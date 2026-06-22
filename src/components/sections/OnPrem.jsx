import { useT } from "../../i18n.jsx";
import { Lines } from "../../lib/ui.jsx";

export default function OnPrem() {
  const { t } = useT();
  return (
    <section className="worldwide">
      <div className="container">
        <div className="worldwide__head reveal">
          <div>
            <span className="eyebrow eyebrow--orange">{t.onprem.eyebrow}</span>
            <h2><Lines text={t.onprem.h2} /></h2>
          </div>
          <div className="worldwide__aside">
            <p>{t.onprem.body}</p>
            <a href="#solutions" className="btn btn--primary btn--sm">{t.onprem.cta}</a>
          </div>
        </div>
        <div className="rack reveal" aria-hidden="true">
          <div className="rack__unit rack__unit--brand"><span>aleph0I</span></div>
          <div className="rack__unit rack__bays">{Array.from({ length: 12 }).map((_, i) => <i key={i}></i>)}</div>
          <div className="rack__unit rack__bays">{Array.from({ length: 12 }).map((_, i) => <i key={i}></i>)}</div>
          <div className="rack__unit rack__vents"></div>
        </div>
      </div>
    </section>
  );
}
