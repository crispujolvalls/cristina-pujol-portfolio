import type { PortfolioMedia } from "../../content/portfolioMedia";
import { optimizedImageSources } from "../../content/optimizedImageSources";
import { useEffect, useRef, useState, type ReactNode } from "react";

const preloadTargets = new Map<Element, () => void>();
const visibilityTargets = new Map<Element, (isVisible: boolean) => void>();
const preloadObservers = new Map<Element | null, IntersectionObserver>();
const visibilityObservers = new Map<Element | null, IntersectionObserver>();
const playbackCandidates = new Map<HTMLVideoElement, { eligible: boolean; priority: number }>();
const primedVideoFrames = new WeakSet<HTMLVideoElement>();
const playRejectedCallbacks = new WeakMap<HTMLVideoElement, () => void>();
let activeVideo: HTMLVideoElement | null = null;
let playbackFrame = 0;
let visibilityListenerAttached = false;

const updateVideoPlayback = () => {
  playbackFrame = 0;
  if (document.visibilityState !== "visible") {
    activeVideo?.pause();
    activeVideo = null;
    playbackCandidates.forEach((_candidate, video) => video.pause());
    return;
  }

  const currentCandidate = activeVideo ? playbackCandidates.get(activeVideo) : undefined;
  const eligibleVideos = [...playbackCandidates]
    .filter(([video, candidate]) => candidate.eligible && video.hasAttribute("src"))
    .sort(([, a], [, b]) => b.priority - a.priority);
  const highestPriority = eligibleVideos[0]?.[1].priority ?? Number.NEGATIVE_INFINITY;
  const nextVideo = activeVideo && currentCandidate?.eligible && currentCandidate.priority >= highestPriority
    ? activeVideo
    : eligibleVideos[0]?.[0] ?? null;

  playbackCandidates.forEach((_candidate, video) => {
    if (video !== nextVideo) {
      video.pause();
      if (video.hasAttribute("src") && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        && video.duration > 0 && !primedVideoFrames.has(video)) {
        primedVideoFrames.add(video);
        video.currentTime = Math.min(0.05, video.duration / 2);
      }
    }
    video.preload = video === nextVideo ? "auto" : "metadata";
  });

  activeVideo = nextVideo;
  if (!nextVideo || !nextVideo.paused) return;

  void nextVideo.play().catch(() => {
    if (activeVideo !== nextVideo) return;
    activeVideo = null;
    const candidate = playbackCandidates.get(nextVideo);
    if (candidate) candidate.eligible = false;
    playRejectedCallbacks.get(nextVideo)?.();
    scheduleVideoPlayback();
  });
};

function scheduleVideoPlayback() {
  if (playbackFrame) return;
  playbackFrame = window.requestAnimationFrame(updateVideoPlayback);
}

const registerPlaybackCandidate = (
  video: HTMLVideoElement,
  priority: number,
) => {
  const candidate = { eligible: false, priority };
  const wakePlayback = () => scheduleVideoPlayback();
  const handlePlay = () => {
    candidate.eligible = true;
    activeVideo = video;
    scheduleVideoPlayback();
  };
  const handleError = () => {
    candidate.eligible = false;
    if (activeVideo === video) activeVideo = null;
    playRejectedCallbacks.get(video)?.();
    scheduleVideoPlayback();
  };
  playbackCandidates.set(video, candidate);
  video.addEventListener("loadeddata", wakePlayback);
  video.addEventListener("loadedmetadata", wakePlayback);
  video.addEventListener("canplay", wakePlayback);
  video.addEventListener("play", handlePlay);
  video.addEventListener("error", handleError);
  if (!visibilityListenerAttached) {
    document.addEventListener("visibilitychange", scheduleVideoPlayback);
    visibilityListenerAttached = true;
  }
  scheduleVideoPlayback();

  return () => {
    video.removeEventListener("loadeddata", wakePlayback);
    video.removeEventListener("loadedmetadata", wakePlayback);
    video.removeEventListener("canplay", wakePlayback);
    video.removeEventListener("play", handlePlay);
    video.removeEventListener("error", handleError);
    if (playbackCandidates.get(video) === candidate) playbackCandidates.delete(video);
    if (activeVideo === video) {
      video.pause();
      activeVideo = null;
    }
    if (playbackCandidates.size === 0 && visibilityListenerAttached) {
      document.removeEventListener("visibilitychange", scheduleVideoPlayback);
      visibilityListenerAttached = false;
    }
    scheduleVideoPlayback();
  };
};

const setPlaybackEligibility = (video: HTMLVideoElement, eligible: boolean) => {
  const candidate = playbackCandidates.get(video);
  if (!candidate || candidate.eligible === eligible) return;
  candidate.eligible = eligible;
  scheduleVideoPlayback();
};

const observeVideo = (
  video: HTMLVideoElement,
  onNear: () => void,
  onVisibility: (isVisible: boolean) => void,
  root: Element | null = null,
) => {
  if (!("IntersectionObserver" in window)) {
    onNear();
    onVisibility(true);
    return () => undefined;
  }

  let preloadObserver = preloadObservers.get(root);
  if (!preloadObserver) {
    preloadObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        preloadTargets.get(entry.target)?.();
        preloadTargets.delete(entry.target);
        preloadObservers.get(root)?.unobserve(entry.target);
      });
    }, { root, rootMargin: "350px 0px" });
    preloadObservers.set(root, preloadObserver);
  }
  let visibilityObserver = visibilityObservers.get(root);
  if (!visibilityObserver) {
    visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibilityTargets.get(entry.target)?.(entry.isIntersecting && entry.intersectionRatio >= 0.2));
    }, { threshold: [0, 0.2] });
    visibilityObservers.set(root, visibilityObserver);
  }

  preloadTargets.set(video, onNear);
  visibilityTargets.set(video, onVisibility);
  preloadObserver.observe(video);
  visibilityObserver.observe(video);

  return () => {
    preloadTargets.delete(video);
    visibilityTargets.delete(video);
    preloadObservers.get(root)?.unobserve(video);
    visibilityObservers.get(root)?.unobserve(video);
  };
};

type MediaSlotProps = {
  asset: PortfolioMedia;
  className?: string;
  children?: ReactNode;
  ariaLive?: "polite" | "off";
  active?: boolean;
  loadWhenNear?: boolean;
  playbackPriority?: number;
  observerRoot?: Element | null;
  showPlayFallback?: boolean;
  preload?: "none" | "metadata" | "auto";
  imageSizes?: string;
  priority?: boolean;
};

const MediaSlot = ({
  asset,
  className = "",
  children,
  ariaLive,
  active,
  loadWhenNear = false,
  playbackPriority = 0,
  observerRoot = null,
  showPlayFallback = false,
  preload,
  imageSizes = "(max-width: 760px) 80vw, 35vw",
  priority = false,
}: MediaSlotProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const optimizedImage = asset.src ? optimizedImageSources[asset.src] : undefined;
  const shouldPlayVideo = asset.kind === "video" && (active ?? true) && nearViewport;
  const shouldLoadVideo = asset.kind === "video" && nearViewport && ((active ?? true) || loadWhenNear);
  const imagePriorityAttribute = priority ? { fetchpriority: "high" } : {};

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    return observeVideo(video, () => setNearViewport(true), setInViewport, observerRoot);
  }, [asset.kind, asset.src, observerRoot]);

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    playRejectedCallbacks.set(video, () => setPlaybackFailed(true));
    return registerPlaybackCandidate(
      video,
      playbackPriority,
    );
  }, [asset.kind, asset.src, playbackPriority]);

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    setPlaybackEligibility(video, shouldPlayVideo && inViewport);
  }, [asset.kind, asset.src, inViewport, shouldPlayVideo]);

  return (
    <div className={`media-slot${asset.src ? " has-media" : " media-placeholder"} ${className}`} aria-live={ariaLive}>
      {asset.src ? asset.kind === "video" ? (
        <video
          ref={videoRef}
          className="media-slot-content"
          src={shouldLoadVideo ? asset.src : undefined}
          autoPlay={false}
          muted
          loop
          playsInline
          webkit-playsinline={showPlayFallback ? "true" : undefined}
          controls={showPlayFallback && playbackFailed}
          preload={shouldLoadVideo ? preload ?? "metadata" : "none"}
          aria-label={asset.alt}
        />
      ) : (
        <picture className="media-image-picture">
          {optimizedImage && <source type="image/webp" srcSet={optimizedImage.srcSet} sizes={imageSizes} />}
          <img
            {...imagePriorityAttribute}
            className="media-slot-content"
            src={optimizedImage?.fallbackSrc ?? asset.src}
            alt={asset.alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            sizes={imageSizes}
          />
        </picture>
      ) : (
        <>
          <span className="placeholder-mark" aria-hidden="true">✳</span>
          <span className="placeholder-label">{asset.placeholder}</span>
        </>
      )}
      {children}
    </div>
  );
};

export default MediaSlot;
