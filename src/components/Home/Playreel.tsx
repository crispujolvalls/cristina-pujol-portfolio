import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";

const Playreel = () => {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = document.querySelector<HTMLElement>(".work-reveal");
      const frame = section?.querySelector<HTMLElement>(".work-reveal-frame");
      const title = section?.querySelector<HTMLElement>(".work-reveal-title");
      const [behind, theTreatment] = title?.querySelectorAll<HTMLElement>("span") ?? [];
      if (!section || !frame || !title || !behind || !theTreatment) return;

      gsap.set(frame, { clearProps: "width,height,borderRadius" });
      gsap.set([behind, theTreatment], { clearProps: "transform" });

      const closingDistance = () => {
        const gap = theTreatment.offsetLeft - (behind.offsetLeft + behind.offsetWidth);
        return Math.max(0, gap / 2);
      };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      timeline.to(behind, { x: closingDistance, ease: "none" }, 0);
      timeline.to(theTreatment, { x: () => -closingDistance(), ease: "none" }, 0);
    });
    return () => media.revert();
  }, []);

  return (
    <section id="playreel" className="work-reveal section-dark">
      <h2 className="work-reveal-title"><span>Behind&nbsp;</span><span>the Treatment</span></h2>
      <MediaSlot className="work-reveal-frame" asset={portfolioMedia.workIntro}>
        <span className="work-reveal-shade" aria-hidden="true" />
      </MediaSlot>
    </section>
  );
};

export default Playreel;
