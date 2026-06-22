import { useT } from "../../i18n.jsx";
import { Lines } from "../../lib/ui.jsx";

const PARTNERS = ["Apple", "Lenovo", "zTouch", "Ben-Gurion University", "Hebrew University", "Federico II", "Rekordata"];

export default function Logos() {
  const { t } = useT();
  const items = [...PARTNERS, ...PARTNERS];
  return (
    <section className="logos">
      <div className="container logos__inner">
        <div className="logos__stat">
          <span className="logos__num">{t.logos.stat}</span>
          <span className="logos__statlabel"><Lines text={t.logos.statLabel} /></span>
        </div>
        <div className="logos__viewport">
          <div className="logos__track">
            {items.map((p, i) => <span key={i} className="logos__item">{p}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
