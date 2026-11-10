import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EditorialCase = () => {
  useGSAP(() => {
    const section = document.querySelector<HTMLElement>(".editorial-case-section");
    const layout = section?.querySelector<HTMLElement>(".editorial-case-layout");
    if (!section || !layout) return;

    const motion = gsap.matchMedia();
    const createScrollMotion = (spreadImages: boolean) => {
      const [upperLeft, upperRight, lowerLeft, lowerRight] = [
        "upper-left",
        "upper-right",
        "lower-left",
        "lower-right",
      ].map((position) => layout.querySelector<HTMLElement>(`.editorial-case-image--${position}`));

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      // Keep the existing upward entrance transition in the same scroll-linked
      // timeline as the image movement so the section has one source of state.
      timeline.fromTo(section, { y: 90 }, { y: 0, duration: 0.22, ease: "none" }, 0);

      if (spreadImages && upperLeft && upperRight && lowerLeft && lowerRight) {
        const finalOverlap = () => layout.clientWidth * 0.015;
        const verticalSpread = () => layout.clientHeight * 0.08;

        // Keep all four moving support images separate throughout the fan-out.
        timeline.fromTo(upperLeft,
          { x: () => upperLeft.offsetWidth * 0.72, y: 0 },
          { x: finalOverlap, y: () => -verticalSpread(), duration: 1, ease: "none" }, 0);
        timeline.fromTo(upperRight,
          { x: () => -upperRight.offsetWidth * 0.5, y: 0 },
          { x: () => -finalOverlap(), y: () => -layout.clientHeight * 0.04, duration: 1, ease: "none" }, 0);
        timeline.fromTo(lowerLeft,
          { x: () => lowerLeft.offsetWidth * 0.65, y: () => layout.clientHeight * 0.105 },
          { x: finalOverlap, y: verticalSpread, duration: 1, ease: "none" }, 0);
        timeline.fromTo(lowerRight,
          { x: () => -lowerRight.offsetWidth * 0.5, y: 0 },
          { x: () => -finalOverlap(), y: 0, duration: 1, ease: "none" }, 0);

        // Let the fan reach its final composition in the first ~56% of the
        // existing section scroll range, then hold that composition to the end.
        const progressHold = { value: 0 };
        timeline.to(progressHold, { value: 1, duration: 0.8, ease: "none" }, 1);
      }
    };

    motion.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      createScrollMotion(true);
    });
    motion.add("(max-width: 760px) and (prefers-reduced-motion: no-preference)", () => {
      createScrollMotion(true);
    });
    return () => motion.revert();
  }, []);

  const positions = ["featured", "upper-left", "upper-right", "lower-left", "lower-right"];
  const imageSizes = [
    "(max-width: 760px) 52vw, 38vw",
    "(max-width: 760px) 27vw, 19vw",
    "(max-width: 760px) 29vw, 22vw",
    "(max-width: 760px) 27vw, 17vw",
    "(max-width: 760px) 29vw, 21vw",
  ];

  return (
    <section className="editorial-case-section section-paper" aria-label="Featured PMU case">
      <div className="editorial-case-layout">
        {portfolioMedia.editorialCase.map((image, index) => (
          <MediaSlot
            key={image.placeholder}
            className={`editorial-case-image editorial-case-image--${positions[index]}`}
            asset={image}
            imageSizes={imageSizes[index]}
          />
        ))}
      </div>
    </section>
  );
};

export default EditorialCase;
