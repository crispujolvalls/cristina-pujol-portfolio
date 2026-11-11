import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";
import { scrollHeadingEntrance } from "../../utils/scrollHeadingEntrance";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Work = () => {
  const [caseResetVersions, setCaseResetVersions] = useState(() =>
    portfolioMedia.selectedWork.cases.map(() => 0),
  );

  const resetCaseMedia = (caseIndex: number) => {
    setCaseResetVersions((versions) => versions.map((version, index) =>
      index === caseIndex ? version + 1 : version,
    ));
  };

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const heading = document.querySelector<HTMLElement>(".selected-work-section .work-intro h2");
      if (!heading) return;

      scrollHeadingEntrance(heading);
    });
    return () => motion.revert();
  }, []);

  return (
    <section id="selected-work" className="selected-work-section">
      <div className="work-showcase section-paper">
        <div className="work-intro page-gutter">
          <h2>Natural-looking results.<br /><em>Subtle enhancement.</em></h2>
        </div>

        <div className="case-grid page-gutter" aria-label="Before and after treatment cases">
          {portfolioMedia.selectedWork.cases.map((workCase, index) => (
            <CaseCard
              key={index}
              caseNumber={index + 1}
              items={workCase.media}
              resetVersion={caseResetVersions[index]}
              onNavigateCase={resetCaseMedia}
            defaultIndex={window.matchMedia("(max-width: 760px)").matches
              ? Math.max(0, workCase.media.findIndex((item) => item.role === "after"))
              : workCase.defaultIndex}
              hoverIndex={workCase.hoverIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

type CaseCardProps = {
  caseNumber: number;
  items: typeof portfolioMedia.selectedWork.cases[number]["media"];
  defaultIndex: number;
  hoverIndex: number;
  resetVersion: number;
  onNavigateCase: (caseIndex: number) => void;
};

const CaseCard = ({ caseNumber, items, defaultIndex, hoverIndex, resetVersion, onNavigateCase }: CaseCardProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const caseLabel = String(caseNumber).padStart(2, "0");
  const isMobileCaseCarousel = window.matchMedia("(max-width: 760px)").matches;

  useLayoutEffect(() => {
    if (resetVersion === 0) return;
    setActiveIndex(0);
    setHasNavigated(true);
    setIsMouseOver(false);
  }, [resetVersion]);

  const navigate = (direction: -1 | 1) => {
    setHasNavigated(true);
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  };

  const navigateCase = (direction: -1 | 1, button: HTMLButtonElement) => {
    const card = button.closest<HTMLElement>(".case-card");
    const carousel = card?.parentElement;
    if (!card || !carousel) return;
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>(":scope > .case-card"));
    const currentIndex = cards.indexOf(card);
    if (currentIndex < 0 || cards.length < 2) return;
    const nextIndex = (currentIndex + direction + cards.length) % cards.length;
    onNavigateCase(nextIndex);
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    carousel.scrollTo({ left: cards[nextIndex].offsetLeft - cards[0].offsetLeft, behavior });
  };

  return (
    <div
      className={`case-card${hasNavigated ? " has-navigated" : ""}`}
      role="group"
      aria-label={`Treatment case ${caseLabel}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && window.matchMedia("(min-width: 761px)").matches) setIsMouseOver(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && window.matchMedia("(min-width: 761px)").matches) {
          setIsMouseOver(false);
          setHasNavigated(false);
          setActiveIndex(defaultIndex);
        }
      }}
    >
      <div
        className={`case-image-stack case-image-stack--case-${caseNumber}`}
        onPointerDown={(event) => {
          if (!window.matchMedia("(max-width: 760px)").matches || (event.target as HTMLElement).closest("button")) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          swipeStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start || !window.matchMedia("(max-width: 760px)").matches || items.length < 2) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.2) {
            return;
          }
          setHasNavigated(true);
          setActiveIndex((current) => (current + (dx < 0 ? 1 : -1) + items.length) % items.length);
        }}
        onPointerCancel={() => { swipeStart.current = null; }}
      >
        {items.map((item, index) => (
          <MediaSlot
            key={`${item.role}-${item.asset.path}`}
            className={`case-image${index === activeIndex ? " is-active" : ""}${item.role === "before" ? " case-image-before" : ""}${index === hoverIndex ? " case-image-hover" : ""}`}
            asset={item.asset}
            active={index === activeIndex || (isMouseOver && !hasNavigated && index === hoverIndex)}
            imageSizes="(max-width: 760px) calc(100vw - 104px), 30vw"
          />
        ))}
        <button
          className="case-nav-arrow case-nav-arrow--previous"
          type="button"
          aria-label={`${isMobileCaseCarousel ? "Previous case" : "Previous media item"} in case ${caseLabel}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (window.matchMedia("(max-width: 760px)").matches) navigateCase(-1, event.currentTarget);
            else navigate(-1);
          }}
        >
          &lt;
        </button>
        <button
          className="case-nav-arrow case-nav-arrow--next"
          type="button"
          aria-label={`${isMobileCaseCarousel ? "Next case" : "Next media item"} in case ${caseLabel}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (window.matchMedia("(max-width: 760px)").matches) navigateCase(1, event.currentTarget);
            else navigate(1);
          }}
        >
          &gt;
        </button>
        {items.length > 1 && <>
          <span className="case-media-count" aria-hidden="true">{activeIndex + 1} / {items.length}</span>
          <span className="case-media-hint" aria-hidden="true">Swipe to view more</span>
        </>}
        <span className="case-media-status" aria-live="polite">
          Case {caseLabel}: {items[activeIndex].label}, media {activeIndex + 1} of {items.length}
        </span>
      </div>
    </div>
  );
};

export default Work;
