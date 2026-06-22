import { useT } from "../../i18n.jsx";
import { Lines } from "../../lib/ui.jsx";

export default function Matchoice() {
  const { t } = useT();
  return (
    <section className="silicon" id="matchoice">
      <div className="container">
        <div className="panel-dark reveal">
          <img src="/img/logo-favi.png" alt="" aria-hidden="true" className="panel-dark__mark" />
          <div className="panel-dark__top">
            <h2><Lines text={t.matchoice.h2} /></h2>
            <div className="panel-dark__aside">
              <p>{t.matchoice.body}</p>
              <a href="#contact" className="btn btn--primary btn--sm">{t.matchoice.cta}</a>
            </div>
          </div>
          <div className="chip reveal" aria-hidden="true">
            <div className="chip__pkg">
              <div className="chip__pins chip__pins--t"></div>
              <div className="chip__pins chip__pins--b"></div>
              <div className="chip__pins chip__pins--l"></div>
              <div className="chip__pins chip__pins--r"></div>
              <div className="chip__label">
                <img src="/img/logo-matchoice.png" alt="matchoice" className="chip__logo" />
                <span className="chip__word">mtx</span>
                <small>MATCHOICE · A01</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
