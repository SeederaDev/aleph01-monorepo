import { useT } from "../../i18n.jsx";
import { SectionHead } from "../../lib/ui.jsx";

export default function Industries() {
  const { t } = useT();
  return (
    <section className="industries" id="industries">
      <SectionHead className="quotes__head" kicker={t.industries.eyebrow} title={t.industries.h2} />
      <div className="container">
        <div className="industries__grid">
          {t.industries.items.map((it, i) => (
            <article className="icard reveal" key={i}>
              <span className="icard__dot" aria-hidden="true"></span>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
