import type { PortfolioMedia } from "../../content/portfolioMedia";
import { optimizedImageSources } from "../../content/optimizedImageSources";
import { useEffect, useRef, useState, type ReactNode } from "react";

const preloadTargets = new Map<Element, () => void>();
const visibilityTargets = new Map<Element, (isVisible: boolean) => void>();
let preloadObserver: IntersectionObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;

const observeVideo = (video: HTMLVideoElement, onNear: () => void, onVisibility: (isVisible: boolean) => void) => {
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
    }, { rootMargin: "500px 0px" });
  }
  if (!visibilityObserver) {
    visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibilityTargets.get(entry.target)?.(entry.isIntersecting));
    });
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
  preload,
  imageSizes = "(max-width: 760px) 80vw, 35vw",
  priority = false,
}: MediaSlotProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const optimizedImage = asset.src ? optimizedImageSources[asset.src] : undefined;
  const shouldLoadVideo = asset.kind === "video" && (active ?? true) && nearViewport;
  const imagePriorityAttribute = priority ? { fetchpriority: "high" } : {};

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    return observeVideo(video, () => setNearViewport(true), setInViewport);
  }, [asset.kind, asset.src]);

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    if (!shouldLoadVideo || !inViewport || document.visibilityState !== "visible") {
      video.pause();
      return;
    }

    const play = () => {
      if (document.visibilityState === "visible" && inViewport) void video.play().catch(() => undefined);
    };
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", play);
    play();
    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", play);
    };
  }, [active, asset.kind, asset.src, inViewport, shouldLoadVideo]);

  return (
    <div className={`media-slot${asset.src ? " has-media" : " media-placeholder"} ${className}`} aria-live={ariaLive}>
      {asset.src ? asset.kind === "video" ? (
        <video
          ref={videoRef}
          className="media-slot-content"
          src={shouldLoadVideo ? asset.src : undefined}
          autoPlay={shouldLoadVideo && inViewport}
          muted
          loop
          playsInline
          preload={shouldLoadVideo ? preload ?? "auto" : "none"}
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
