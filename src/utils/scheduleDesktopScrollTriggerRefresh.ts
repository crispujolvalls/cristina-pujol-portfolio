import { ScrollTrigger } from "gsap/ScrollTrigger";

let refreshFrame = 0;

export const scheduleDesktopScrollTriggerRefresh = () => {
  if (refreshFrame) return;

  refreshFrame = window.requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.refresh();
  });
};
