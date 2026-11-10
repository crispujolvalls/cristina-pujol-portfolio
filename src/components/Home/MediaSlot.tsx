import type { PortfolioMedia } from "../../content/portfolioMedia";
import { useEffect, useRef, type ReactNode } from "react";

type MediaSlotProps = {
  asset: PortfolioMedia;
  className?: string;
  children?: ReactNode;
  ariaLive?: "polite" | "off";
  active?: boolean;
  preload?: "none" | "metadata" | "auto";
};

const MediaSlot = ({ asset, className = "", children, ariaLive, active, preload }: MediaSlotProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (asset.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    if (active === false) {
      video.pause();
      return;
    }

    const play = () => {
      if (document.visibilityState === "visible") void video.play().catch(() => undefined);
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
  }, [active, asset.kind, asset.src]);

  return (
    <div className={`media-slot${asset.src ? " has-media" : " media-placeholder"} ${className}`} aria-live={ariaLive}>
      {asset.src ? asset.kind === "video" ? (
        <video ref={videoRef} className="media-slot-content" src={asset.src} autoPlay={active ?? true} muted loop playsInline preload={preload ?? (active === false ? "none" : "metadata")} aria-label={asset.alt} />
      ) : (
        <img className="media-slot-content" src={asset.src} alt={asset.alt} loading="lazy" />
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
