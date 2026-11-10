import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";
import { portfolioMedia } from "../../content/portfolioMedia";
import { scrollHeadingEntrance } from "../../utils/scrollHeadingEntrance";

gsap.registerPlugin(ScrollTrigger);

const HeadingWords = ({ words, italic = false }: { words: string[]; italic?: boolean }) => (
  <span className={`specialties-heading-line${italic ? " specialties-heading-line--italic" : ""}`} aria-hidden="true">
    {words.map((word) => (
      <span className="specialties-word-mask" key={word}>
        <span className="specialties-word">{italic ? <em>{word}</em> : word}</span>
      </span>
    ))}
  </span>
);

const Specialties = () => {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const heading = document.querySelector<HTMLElement>(".specialties-section .section-heading h2");
      if (!heading) return;
      scrollHeadingEntrance(heading);
    });

    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const gallery = document.querySelector<HTMLElement>(".specialties-gallery");
      const track = document.querySelector<HTMLElement>(".specialties-track");
      if (!gallery || !track) return;

      let travel = 0;
      const setTrackX = gsap.quickSetter(track, "x", "px");
      const finalCardPause = () => Math.min(100, Math.round(window.innerHeight * 0.08));
      const measure = () => {
        travel = Math.max(0, track.scrollWidth - gallery.clientWidth);
      };
      const setTrackProgress = (progress: number) => {
        const scrollDistance = progress * (travel + finalCardPause()) * 1.08;
        setTrackX(-Math.min(travel, scrollDistance));
      };
      measure();
      const trigger = ScrollTrigger.create({
        trigger: gallery,
        start: "top top",
        end: () => {
          measure();
          return `+=${travel + finalCardPause()}`;
        },
        pin: gallery,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onRefresh: (self) => {
          measure();
          setTrackProgress(self.progress);
        },
        onUpdate: (self) => setTrackProgress(self.progress),
      });
      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        window.cancelAnimationFrame(refreshFrame);
        trigger.kill();
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section id="specialties" className="specialties-section section-paper">
      <div className="section-heading page-gutter">
        <h2 aria-label="Treatments that go unnoticed. On purpose.">
          <HeadingWords words={["Treatments"]} />
          <HeadingWords words={["that", "go", "unnoticed."]} />
          <HeadingWords words={["On", "purpose."]} italic />
        </h2>
      </div>
      <p className="specialties-swipe-hint" aria-hidden="true">Swipe to explore <span>→</span></p>
      <div className="specialties-gallery">
        <div className="specialties-window">
          <div className="specialties-track">
            {portfolioMedia.specialties.map(({ name, image }) => (
              <article className="specialty-card" key={name}>
                <MediaSlot className="specialty-image" asset={image} imageSizes="(max-width: 899px) 70vw, 22vw" />
                <h3>{name}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialties;
