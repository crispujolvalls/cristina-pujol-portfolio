import type { PortfolioMedia } from "../../content/portfolioMedia";
import { optimizedImageSources } from "../../content/optimizedImageSources";
import { useEffect, useRef, useState, type ReactNode } from "react";

const preloadTargets = new Map<Element, () => void>();
const visibilityTargets = new Map<Element, (isVisible: boolean) => void>();
let preloadObserver: IntersectionObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
type PlaybackCandidate = {
  eligible: boolean;
  priority: number;
  manualVisibility: boolean;
  allowConcurrentPlayback: boolean;
  activationOrder: number;
  onAttempt?: () => void;
  onStarted?: () => void;
  onBlocked?: () => void;
};

const playbackCandidates = new Map<HTMLVideoElement, PlaybackCandidate>();
const primedVideoFrames = new WeakSet<HTMLVideoElement>();
let playbackActivationOrder = 0;
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

  const concurrentVideos = [...playbackCandidates]
    .filter(([video, candidate]) => candidate.eligible && candidate.allowConcurrentPlayback && video.hasAttribute("src"))
    .map(([video]) => video);
  if (concurrentVideos.length > 0) {
    playbackCandidates.forEach((candidate, video) => {
      if (concurrentVideos.includes(video)) {
        video.preload = "auto";
        if (video.paused) {
          video.defaultMuted = true;
          video.muted = true;
          void video.play().catch(() => {
            candidate.eligible = false;
            scheduleVideoPlayback();
          });
        }
        return;
      }

      video.pause();
      if (video.hasAttribute("src")) video.preload = "metadata";
    });
    activeVideo = null;
    return;
  }

  const currentCandidate = activeVideo ? playbackCandidates.get(activeVideo) : undefined;
  const eligibleVideos = [...playbackCandidates]
    .filter(([video, candidate]) => candidate.eligible && video.hasAttribute("src"))
    .sort(([, a], [, b]) => b.priority - a.priority);
  const highestPriority = eligibleVideos[0]?.[1].priority ?? Number.NEGATIVE_INFINITY;
  const recentManualVideo = eligibleVideos
    .filter(([, candidate]) => candidate.manualVisibility)
    .sort(([, a], [, b]) => b.activationOrder - a.activationOrder || b.priority - a.priority)[0]?.[0] ?? null;
  const nextVideo = recentManualVideo
    ?? (activeVideo && currentCandidate?.eligible && currentCandidate.priority >= highestPriority
      ? activeVideo
      : eligibleVideos[0]?.[0] ?? null);

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

  nextVideo.defaultMuted = true;
  nextVideo.muted = true;
  nextVideo.playsInline = true;
  nextVideo.setAttribute("muted", "");
  playbackCandidates.get(nextVideo)?.onAttempt?.();

  void nextVideo.play().catch((reason: unknown) => {
    if (activeVideo !== nextVideo) return;
    activeVideo = null;
    const candidate = playbackCandidates.get(nextVideo);
    if (candidate) candidate.eligible = false;
    const errorName = typeof reason === "object" && reason !== null && "name" in reason
      ? String((reason as { name: unknown }).name)
      : "";
    if (errorName === "NotAllowedError") candidate?.onBlocked?.();
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
  manualVisibility: boolean,
  allowConcurrentPlayback: boolean,
  callbacks: Pick<PlaybackCandidate, "onAttempt" | "onStarted" | "onBlocked">,
) => {
  const candidate: PlaybackCandidate = {
    eligible: false,
    priority,
    manualVisibility,
    allowConcurrentPlayback,
    activationOrder: 0,
    ...callbacks,
  };
  const wakePlayback = () => scheduleVideoPlayback();
  const handlePlay = () => {
    if (!candidate.eligible) candidate.activationOrder = ++playbackActivationOrder;
    candidate.eligible = true;
    activeVideo = video;
    candidate.onStarted?.();
    scheduleVideoPlayback();
  };
  const handleError = () => {
    candidate.eligible = false;
    if (activeVideo === video) activeVideo = null;
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
  if (eligible) candidate.activationOrder = ++playbackActivationOrder;
  candidate.eligible = eligible;
  scheduleVideoPlayback();
};

const observeVideo = (
  video: HTMLVideoElement,
  onNear: () => void,
  onVisibility: (isVisible: boolean) => void,
) => {
  if (!("IntersectionObserver" in window)) {
    onNear();
    onVisibility(true);
    return () => undefined;
  }

  if (!preloadObserver) {
    preloadObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        preloadTargets.get(entry.target)?.();
        preloadTargets.delete(entry.target);
        preloadObserver?.unobserve(entry.target);
      });
    }, { rootMargin: "350px 0px" });
  }
  if (!visibilityObserver) {
    visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibilityTargets.get(entry.target)?.(entry.isIntersecting && entry.intersectionRatio >= 0.2));
    }, { threshold: [0, 0.2] });
  }

  preloadTargets.set(video, onNear);
  visibilityTargets.set(video, onVisibility);
  preloadObserver.observe(video);
  visibilityObserver.observe(video);

  return () => {
    preloadTargets.delete(video);
    visibilityTargets.delete(video);
    preloadObserver?.unobserve(video);
    visibilityObserver?.unobserve(video);
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
  loadOnDemand?: boolean;
  manualVisibility?: boolean;
  allowConcurrentPlayback?: boolean;
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
  loadOnDemand = false,
  manualVisibility = false,
  allowConcurrentPlayback = false,
  showPlayFallback = false,
  preload,
  imageSizes = "(max-width: 760px) 80vw, 35vw",
  priority = false,
}: MediaSlotProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [videoHasStarted, setVideoHasStarted] = useState(false);
  const optimizedImage = asset.src ? optimizedImageSources[asset.src] : undefined;
  const videoPoster = asset.kind === "video" && asset.src
    ? asset.src.replace(/\.mp4$/i, "-poster.webp")
    : undefined;
  const isActive = active ?? true;
  const shouldPlayVideo = asset.kind === "video" && isActive && (manualVisibility || nearViewport);
  const shouldLoadVideo = asset.kind === "video" && (
    loadOnDemand || (nearViewport && (isActive || loadWhenNear))
  );
  const imagePriorityAttribute = priority ? { fetchpriority: "high" } : {};

  useEffect(() => {
    setVideoHasStarted(false);
    setPlaybackFailed(false);
  }, [asset.src]);

  useEffect(() => {
    if (asset.kind !== "video" || manualVisibility) return;
    const video = videoRef.current;
    if (!video) return;
    return observeVideo(video, () => setNearViewport(true), setInViewport);
  }, [asset.kind, asset.src, manualVisibility]);

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    return registerPlaybackCandidate(
      video,
      playbackPriority,
      manualVisibility,
      allowConcurrentPlayback,
      {
        onAttempt: () => setPlaybackFailed(false),
        onStarted: () => setPlaybackFailed(false),
        onBlocked: () => setPlaybackFailed(true),
      },
    );
  }, [asset.kind, asset.src, playbackPriority, manualVisibility, allowConcurrentPlayback]);

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    setPlaybackEligibility(video, shouldPlayVideo && (manualVisibility || inViewport));
  }, [asset.kind, asset.src, inViewport, manualVisibility, shouldPlayVideo]);

  return (
    <div className={`media-slot${asset.src ? " has-media" : " media-placeholder"} ${className}`} aria-live={ariaLive}>
      {asset.src ? asset.kind === "video" ? (
        <>
          {shouldLoadVideo && videoPoster && !videoHasStarted && !playbackFailed && (
            <img
              className="media-slot-content media-video-poster"
              src={videoPoster}
              alt=""
              aria-hidden="true"
              decoding="async"
            />
          )}
          <video
            ref={videoRef}
            className="media-slot-content"
            src={shouldLoadVideo ? asset.src : undefined}
            poster={shouldLoadVideo ? videoPoster : undefined}
            autoPlay={false}
            muted
            loop
            playsInline
            webkit-playsinline={showPlayFallback ? "true" : undefined}
            controls={showPlayFallback && playbackFailed}
            preload={shouldLoadVideo ? preload ?? "metadata" : "none"}
            onPlaying={() => setVideoHasStarted(true)}
            onWaiting={() => setVideoHasStarted(false)}
            aria-label={asset.alt}
          />
          {playbackFailed && !showPlayFallback && (
            <button
              className="media-video-play"
              type="button"
              aria-label={`Play ${asset.alt}`}
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                video.defaultMuted = true;
                video.muted = true;
                video.playsInline = true;
                setPlaybackFailed(false);
                void video.play().catch(() => setPlaybackFailed(true));
              }}
            >
              <span aria-hidden="true">▶</span>
            </button>
          )}
        </>
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
