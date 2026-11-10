import { useEffect, useState } from "react";

const phrases = ["beauty.", "great things together.", "something extraordinary."];

const Contact = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState(phrases[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let character = phrases[0].length;
    let deleting = true;
    let timer = 0;

    const tick = () => {
      const current = phrases[index];
      if (deleting) {
        character -= 1;
        setVisibleText(current.slice(0, character));
        if (character <= 0) {
          deleting = false;
          index = (index + 1) % phrases.length;
          timer = window.setTimeout(tick, 420);
          return;
        }
      } else {
        character += 1;
        setVisibleText(phrases[index].slice(0, character));
        if (character >= phrases[index].length) {
          deleting = true;
          setPhraseIndex(index);
          timer = window.setTimeout(tick, 1900);
          return;
        }
      }
      timer = window.setTimeout(tick, deleting ? 30 : 55);
    };

    timer = window.setTimeout(tick, 1900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="contact" className="contact-section section-dark" aria-labelledby="contact-heading">
      <div className="contact-inner page-gutter">
        <h2 id="contact-heading" className="contact-heading">
          <span className="contact-static-line">Let’s create</span>
          <span className="contact-dynamic-line">
            <span className="contact-typewriter-reserve" aria-hidden="true">something extraordinary.</span>
            <span className="contact-typewriter-text" aria-hidden="true">
              {visibleText}<span className="typewriter-caret" />
            </span>
          </span>
          <span className="contact-announcement" aria-live="polite">{phrases[phraseIndex]}</span>
        </h2>
        <p className="contact-prompt">Seeking new opportunities <span className="contact-prompt-second-line">and exciting challenges.</span></p>
        <a className="contact-cta" href="mailto:cristinapujol27@gmail.com?subject=Portfolio%20enquiry">
          Get in touch
        </a>
        <div className="contact-details" aria-label="Contact details">
          <a href="https://www.instagram.com/shatenbeauty/" target="_blank" rel="noopener noreferrer">
            <span>Instagram</span><span>@shatenbeauty</span>
          </a>
          <a href="mailto:cristinapujol27@gmail.com">
            <span>Email</span><span>cristinapujol27@gmail.com</span>
          </a>
          <a href="tel:+34688927022">
            <span>Phone</span><span>+34 688 927 022</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
