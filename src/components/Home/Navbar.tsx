import { useEffect, useState } from "react";

const links = [
  ["Home", "hero"],
  ["Specialties", "specialties"],
  ["Cases", "selected-work"],
  ["Approach", "methodology"],
  ["Highlights", "instagram"],
  ["Contact", "contact"],
];

const Navbar = () => {
  const [activeArea, setActiveArea] = useState<"hero" | "approach" | "light" | "hidden">("hero");

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#hero");
    const methodology = document.querySelector<HTMLElement>("#methodology");
    const contact = document.querySelector<HTMLElement>("#contact");
    if (!hero || !methodology || !contact) return;

    const updateArea = () => {
      const activationLine = window.innerHeight * 0.5;
      const heroBounds = hero.getBoundingClientRect();
      const methodologyBounds = methodology.getBoundingClientRect();
      const contactBounds = contact.getBoundingClientRect();

      if (heroBounds.top <= activationLine && heroBounds.bottom > activationLine) {
        setActiveArea("hero");
      } else if (methodologyBounds.top <= activationLine && methodologyBounds.bottom > activationLine) {
        setActiveArea("approach");
      } else if (contactBounds.top <= window.innerHeight * 1.15 && contactBounds.bottom > activationLine) {
        setActiveArea("light");
      } else {
        setActiveArea("hidden");
      }
    };

    updateArea();
    window.addEventListener("scroll", updateArea, { passive: true });
    window.addEventListener("resize", updateArea);
    return () => {
      window.removeEventListener("scroll", updateArea);
      window.removeEventListener("resize", updateArea);
    };
  }, []);

  const navigationHidden = activeArea === "hidden" || activeArea === "approach";

  return (
    <header
      className={`site-header${navigationHidden ? "" : " is-visible"}${activeArea === "hero" ? " is-on-hero" : ""}${activeArea === "light" ? " is-on-contact" : ""}`}
      aria-hidden={navigationHidden || undefined}
    >
      <nav id="main-navigation" className="site-nav" aria-label="Main navigation">
        {links.map(([label, id]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
