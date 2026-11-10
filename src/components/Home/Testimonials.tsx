import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";
import { useLayoutEffect, useRef, useState } from "react";

type TestimonialItem = (typeof portfolioMedia.testimonials.topRow)[number];

const TestimonialCard = ({ item }: { item: TestimonialItem }) => (
  <article className="testimonial-card">
    <blockquote>{item.review ?? "[CLIENT TESTIMONIAL — PLACEHOLDER]"}</blockquote>
    <div className="testimonial-client">
      <MediaSlot className="testimonial-photo" asset={item.photo} imageSizes="56px" />
      <div className="testimonial-client-copy">
        <p className="testimonial-name">{item.name}</p>
      </div>
    </div>
  </article>
);

const TestimonialMarquee = ({ items, reverse = false, label }: { items: typeof portfolioMedia.testimonials.topRow; reverse?: boolean; label: string }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useLayoutEffect(() => {
    const marquee = marqueeRef.current;
    const group = groupRef.current;
    if (!marquee || !group) return;

    const mobileViewport = window.matchMedia("(max-width: 760px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const centerOnRepeatedGroup = () => {
      if (!mobileViewport.matches) {
        marquee.scrollLeft = 0;
        return;
      }
      if (!reducedMotion.matches) marquee.scrollLeft = group.getBoundingClientRect().width;
    };
    const recenterAtLoopBoundary = () => {
      if (!mobileViewport.matches || reducedMotion.matches) return;
      const groupWidth = group.getBoundingClientRect().width;
      if (!groupWidth) return;
      if (marquee.scrollLeft < groupWidth * 0.5) marquee.scrollLeft += groupWidth;
      else if (marquee.scrollLeft > groupWidth * 1.5) marquee.scrollLeft -= groupWidth;
    };

    centerOnRepeatedGroup();
    window.addEventListener("resize", centerOnRepeatedGroup);
    marquee.addEventListener("scroll", recenterAtLoopBoundary, { passive: true });
    return () => {
      window.removeEventListener("resize", centerOnRepeatedGroup);
      marquee.removeEventListener("scroll", recenterAtLoopBoundary);
    };
  }, []);

  const className = `testimonial-marquee${reverse ? " testimonial-marquee-reverse" : " testimonial-marquee-forward"}${isInteracting ? " is-interacting" : ""}`;
  return (
    <div
      ref={marqueeRef}
      className={className}
      aria-label={label}
      onPointerDown={(event) => {
        setIsInteracting(true);
        if (event.pointerType === "mouse") event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={() => setIsInteracting(false)}
      onPointerCancel={() => setIsInteracting(false)}
      onLostPointerCapture={() => setIsInteracting(false)}
    >
      <div className="testimonial-track">
        <div className="testimonial-group" ref={groupRef}>{items.map((item, index) => <TestimonialCard key={`${label}-${index}`} item={item} />)}</div>
        <div className="testimonial-group" aria-hidden="true">{items.map((item, index) => <TestimonialCard key={`${label}-copy-${index}`} item={item} />)}</div>
        <div className="testimonial-group testimonial-group--mobile-copy" aria-hidden="true">{items.map((item, index) => <TestimonialCard key={`${label}-copy-2-${index}`} item={item} />)}</div>
        <div className="testimonial-group testimonial-group--mobile-copy" aria-hidden="true">{items.map((item, index) => <TestimonialCard key={`${label}-copy-3-${index}`} item={item} />)}</div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const topRow = portfolioMedia.testimonials.topRow;
  const bottomRow = portfolioMedia.testimonials.bottomRow;

  return (
    <section id="testimonials" className="testimonials-section" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="testimonials-heading page-gutter">
        Kind words from <span>satisfied clients</span>
      </h2>
      <TestimonialMarquee items={topRow} label="Client reviews, first row" />
      <TestimonialMarquee items={bottomRow} reverse label="Client reviews, second row" />
    </section>
  );
};

export default Testimonials;
