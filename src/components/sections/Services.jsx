import { useT } from "../../i18n.jsx";
import { SectionHead } from "../../lib/ui.jsx";

export default function Services() {
  const { t } = useT();
  return (
    <section className="cloud" id="solutions">
      <SectionHead className="cloud__head" kicker={t.services.eyebrow} title={t.services.h2} />
      <div className="container">
        <div className="services">
          {t.services.items.map((s, i) => (
            <article className="scard reveal" key={i}>
              <span className="scard__no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
