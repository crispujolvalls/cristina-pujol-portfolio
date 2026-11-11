import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Instagram = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 760px)").matches);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 760px)");
    const updateViewport = () => setIsMobile(mobileViewport.matches);
    mobileViewport.addEventListener("change", updateViewport);
    return () => mobileViewport.removeEventListener("change", updateViewport);
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const logo = section?.querySelector<SVGElement>(".highlights-instagram-mark");
    if (!section || !logo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const setRotation = gsap.quickSetter(logo, "rotation", "deg");
    const startRotation = 0;
    const endRotation = 180;
    const updateRotation = (progress: number) => setRotation(startRotation + (endRotation - startRotation) * progress);
    setRotation(startRotation);
    const trigger = ScrollTrigger.create({
      trigger: section,
      // Keep the mark upright as the section first enters view, then begin
      // rotating once the viewer has moved further into the section.
      start: "top 50%",
      end: "bottom top",
      invalidateOnRefresh: true,
      onUpdate: (self) => updateRotation(self.progress),
      onRefresh: (self) => updateRotation(self.progress),
      onLeave: () => setRotation(endRotation),
      onLeaveBack: () => setRotation(startRotation),
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      trigger.kill();
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="instagram" className="instagram-section section-dark" aria-labelledby="highlights-heading">
      <h2 id="highlights-heading" className="highlights-heading"><span>Recent</span><strong>Highlights</strong></h2>
      <svg className="highlights-instagram-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="instagram-logo-gradient" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEDA75" />
            <stop offset=".28" stopColor="#FA7E1E" />
            <stop offset=".55" stopColor="#D62976" />
            <stop offset=".78" stopColor="#962FBF" />
            <stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="5.2" stroke="url(#instagram-logo-gradient)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.1" stroke="url(#instagram-logo-gradient)" strokeWidth="1.8" />
        <circle cx="17.7" cy="6.5" r="1.1" fill="url(#instagram-logo-gradient)" />
      </svg>
      <div className="highlights-grid page-gutter" aria-label="Four Instagram video placeholders">
        <div className="highlights-track">
          {portfolioMedia.instagramHighlights.map((video, index) => (
            <article className="highlight-phone" key={video.placeholder} aria-label={`Instagram video ${String(index + 1).padStart(2, "0")}`}>
              <div className="highlight-device">
                <MediaSlot
                  className={`highlight-screen${index === 1 ? " highlight-screen--fit" : ""}`}
                  asset={video}
                  playbackPriority={isMobile ? (index === 0 ? 2 : 1) : 0}
                />
                <span className="highlight-island" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
      <a
        className="highlights-follow"
        href="https://www.instagram.com/shatenbeauty/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Follow the journey
      </a>
    </section>
  );
};

export default Instagram;
