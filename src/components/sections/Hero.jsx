import { useT } from "../../i18n.jsx";
import Hero3D from "../Hero3D.jsx";

export default function Hero() {
  const { t } = useT();
  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="feature feature--bare reveal">
          <Hero3D />
        </div>

        <div className="hero__copy reveal">
          <span className="eyebrow eyebrow--orange">{t.hero.eyebrow}</span>
          <h1>{t.hero.h1}</h1>
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
