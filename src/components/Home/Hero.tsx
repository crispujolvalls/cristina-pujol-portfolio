import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";
import cristinaSignature from "../../assets/cristinas-signature.png";

const Hero = () => {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".hero-title", {
        yPercent: -90,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section id="hero" className="hero-section section-dark">
      <MediaSlot className="hero-visual-placeholder" asset={portfolioMedia.hero} />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-copy">
        <div className="hero-title">
          <h1 className="hero-title-heading">
            <img className="hero-first-name" src={cristinaSignature} alt="Cristina's" />
            <span className="hero-portfolio-title">PORTFOLIO</span>
          </h1>
          <p className="hero-descriptor">PMU ARTIST <span aria-hidden="true">|</span> TOP MASTER</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
