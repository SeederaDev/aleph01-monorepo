import { useT } from "../../i18n.jsx";
import { Lines } from "../../lib/ui.jsx";
import SpotlightScene from "../SpotlightScene.jsx";

export default function Spotlight() {
  const { t } = useT();
  return (
    <section className="spotlight">
      <div className="container">
        <div className="spotlight__card reveal">
          <div className="spotlight__scene" aria-hidden="true"><SpotlightScene /></div>
          <div className="spotlight__top">
            <span className="eyebrow eyebrow--orange">{t.spotlight.eyebrow}</span>
            <h2><Lines text={t.spotlight.h2} /></h2>
            <a href="#industries" className="btn btn--primary btn--sm">{t.spotlight.cta}</a>
          </div>
          <p className="spotlight__desc">{t.spotlight.body}</p>
          <span className="spotlight__partner"><b>aleph0I</b><i>×</i><b className="minicard__groq">mtx</b></span>
        </div>
      </div>
    </section>
  );
}
