import { useEffect, useRef } from "react";
import { useLenisGsap } from "../hooks/useLenisGsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import EditorialCase from "./EditorialCase";
import Navbar from "./Navbar";
import Specialties from "./Specialties";
import Work from "./Work";
import Statistics from "./Statistics";
import Methodology from "./Methodology";
import Instagram from "./Instagram";
import Testimonials from "./Testimonials";
import Contact from "./Contact";

const Home = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  useLenisGsap(pageRef);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 899px)");
    if (!mobileViewport.matches) return;

    let refreshTimer = 0;
    let refreshFrame = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 120);
    };

    const observer = "ResizeObserver" in window && pageRef.current
      ? new ResizeObserver(scheduleRefresh)
      : null;
    if (pageRef.current) observer?.observe(pageRef.current);

    window.addEventListener("orientationchange", scheduleRefresh);
    void document.fonts?.ready.then(scheduleRefresh);

    return () => {
      window.clearTimeout(refreshTimer);
      window.cancelAnimationFrame(refreshFrame);
      observer?.disconnect();
      window.removeEventListener("orientationchange", scheduleRefresh);
    };
  }, []);

  return (
    <div ref={pageRef} id="homeFixedContainer" className="portfolio-shell">
      <Navbar />
      <main>
        <Hero />
        <EditorialCase />
        <Specialties />
        <Work />
        <Statistics />
        <Methodology />
        <Instagram />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
};

export default Home;
