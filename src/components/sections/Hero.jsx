import { lazy, Suspense } from "react";
import { useT } from "../../i18n.jsx";

const Hero3D = lazy(() => import("../Hero3D.jsx"));

/* Render the hero headline: "\n" becomes a line break and every "&" is
   wrapped in a serif span so the ampersand reads cleanly. */
const renderHeadline = (text = "") =>
  text.split("\n").map((line, li, lines) => (
    <span key={li}>
      {line.split("&").map((part, pi, parts) => (
        <span key={pi}>
          {part}
          {pi < parts.length - 1 && <span className="amp">&amp;</span>}
        </span>
      ))}
      {li < lines.length - 1 && <br />}
    </span>
  ));

export default function Hero() {
  const { t } = useT();
  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="feature feature--bare reveal">
          <Suspense fallback={null}>
            <Hero3D />
          </Suspense>
        </div>

        <div className="hero__copy reveal">
          <span className="eyebrow eyebrow--orange">{t.hero.eyebrow}</span>
          <h1>{renderHeadline(t.hero.h1)}</h1>
          <a href="#contact" className="btn btn--primary">{t.hero.cta}</a>
          <div className="hero__cards">
            <a href="#matchoice" className="minicard">
              <span className="minicard__kicker">{t.hero.card1Kicker}</span>
              <p>{t.hero.card1}</p>
            </a>
            <a href="#about" className="minicard">
              <span className="minicard__kicker">{t.hero.card2Kicker}</span>
              <p>{t.hero.card2}</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
