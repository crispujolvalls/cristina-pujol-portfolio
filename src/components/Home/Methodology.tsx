import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";

const steps = [
  { number: "01", title: "Consultation", description: "The client’s preferences, expectations and desired results are discussed." },
  { number: "02", title: "Design", description: "A personalised design is created to complement the client’s natural features and facial proportions." },
  { number: "03", title: "Approval", description: "The client reviews and approves the design before the treatment begins." },
  { number: "04", title: "Treatment", description: "The procedure is performed with precision and care, following the approved design." },
  { number: "05", title: "Retouch", description: "The healed results are assessed and any necessary adjustments are made." },
];

const Methodology = () => {
  const [active, setActive] = useState(-1);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 760px)").matches);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 760px)");
    const updateViewport = () => setIsMobile(mobileViewport.matches);
    mobileViewport.addEventListener("change", updateViewport);
    return () => mobileViewport.removeEventListener("change", updateViewport);
  }, []);

  useGSAP(() => {
    const section = document.querySelector<HTMLElement>("#methodology");
    const stepElements = Array.from(document.querySelectorAll<HTMLElement>("#methodology .method-step"));
    if (!section || stepElements.length !== steps.length) return;

    const getActiveStep = () => {
      const activationLine = window.innerHeight * 0.46;
      let currentStep = 0;
      stepElements.forEach((element, index) => {
        if (element.getBoundingClientRect().top <= activationLine) currentStep = index;
      });
      return currentStep;
    };

    const trigger = ScrollTrigger.create({
      id: "methodology-progress",
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      invalidateOnRefresh: true,
      onEnter: () => setActive(0),
      onEnterBack: () => setActive(getActiveStep()),
      onUpdate: () => setActive(getActiveStep()),
      onRefresh: (self) => {
        if (self.isActive) setActive(getActiveStep());
      },
      onLeave: () => setActive(-1),
      onLeaveBack: () => setActive(-1),
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      trigger.kill();
    };
  }, []);

  return (
    <section id="methodology" className="methodology-section section-dark">
      <div className="section-heading page-gutter">
        <h2>A process,<br /><em>with intention.</em></h2>
      </div>
      <div className="method-layout page-gutter">
        <div className="method-steps">
          {steps.map((step, index) => (
            <article id={`method-step-${index + 1}`} className={`method-step${active === index ? " is-active" : ""}`} key={step.number}>
              <span className="method-number">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {isMobile && (
                <div className="method-step-media-reserve">
                  <MediaSlot
                    className="method-step-media"
                    asset={portfolioMedia.methodology[index]}
                    active={active === index}
                    preload="metadata"
                    aria-live="off"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
        {!isMobile && (
          <div className="method-visual-column">
            <MediaSlot className="method-visual" asset={portfolioMedia.methodology[Math.max(active, 0)]} aria-live="polite" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Methodology;
