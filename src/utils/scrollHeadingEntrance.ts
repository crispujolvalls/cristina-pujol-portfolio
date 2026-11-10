import gsap from "gsap";

/** Shared scroll-scrubbed entrance used by the Specialties and Selected Work headings. */
export const scrollHeadingEntrance = (heading: HTMLElement) => gsap.fromTo(
  heading,
  { y: () => Math.min(window.innerHeight * 0.18, 180) },
  {
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: heading,
      start: "top bottom",
      end: "top 46%",
      scrub: 0.35,
      invalidateOnRefresh: true,
    },
  },
);
