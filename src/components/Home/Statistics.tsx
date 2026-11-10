import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const statistics = [
  { value: 350, suffix: "+", precision: 0, label: "Five-star Google reviews" },
  { value: 2.5, suffix: "+", precision: 1, label: "Years as a Top Master" },
  { value: 6, suffix: "", precision: 0, label: "Clients per day on average" },
  { value: 91, suffix: "%", precision: 0, label: "Client retention" },
];

const formatValue = (value: number, precision: number, suffix: string) =>
  `${precision ? value.toFixed(precision) : Math.floor(value)}${suffix}`;

const Statistics = () => {
  const countersRef = useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(() => {
    const section = document.getElementById("professional-statistics");
    if (!section) return;

    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const progress = { value: 0 };
      countersRef.current.forEach((counter, index) => {
        if (counter) counter.textContent = formatValue(0, statistics[index].precision, statistics[index].suffix);
      });

      gsap.to(progress, {
        value: 1,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
        onUpdate: () => {
          countersRef.current.forEach((counter, index) => {
            if (!counter) return;
            const statistic = statistics[index];
            counter.textContent = formatValue(statistic.value * progress.value, statistic.precision, statistic.suffix);
          });
        },
      });
    });
    return () => motion.revert();
  }, []);

  return (
    <section id="professional-statistics" className="statistics-section section-dark" aria-label="Professional statistics">
      <h2 className="statistics-heading">A few milestones along the way.</h2>
      <div className="statistics-grid page-gutter">
        {statistics.map((statistic, index) => (
          <article className="statistic-item" key={statistic.label}>
            <span
              ref={(element) => { countersRef.current[index] = element; }}
              className="statistic-value"
              aria-label={`${statistic.value}${statistic.suffix}`}
            >
              {formatValue(statistic.value, statistic.precision, statistic.suffix)}
            </span>
            <span className="statistic-label">{statistic.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
