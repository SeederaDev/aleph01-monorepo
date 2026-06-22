import { useState } from "react";
import { useT } from "../../i18n.jsx";

export default function Contact() {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  return (
    <section className="build" id="contact">
      <div className="container">
        <div className="build__panel reveal">
          <img src="/img/logo-favi.png" alt="" aria-hidden="true" className="build__mark" />
          <span className="eyebrow eyebrow--onorange">{t.contact.eyebrow}</span>
          <h2>{t.contact.h2}</h2>
          <p>{t.contact.body}</p>
          <form className="build__form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <input type="email" required placeholder={t.contact.placeholder} aria-label="email" />
            <button type="submit" className="btn btn--dark">{sent ? "✓" : t.contact.cta}</button>
          </form>
          <span className="build__note">{t.contact.note}</span>
        </div>
      </div>
    </section>
  );
}
