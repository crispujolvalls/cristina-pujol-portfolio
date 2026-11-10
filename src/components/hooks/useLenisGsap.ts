import { useEffect, type RefObject } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useLenisGsap = (_containerRef?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchInput = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || touchInput) return;

    const lenis = new Lenis();
    const update = (time: number) => lenis.raf(time * 1000);
    const updateScrollTrigger = () => ScrollTrigger.update();

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(update);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);
};
