import { useEffect, useState } from "react";
import { useT } from "../i18n.jsx";

/* Accessible modal that renders the Privacy / Cookie policy.
   Opened via the "a01-legal" event (detail = "privacy" | "cookie"). */
export default function LegalModal() {
  const { t } = useT();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const on = (e) => setDoc(e.detail);
    window.addEventListener("a01-legal", on);
    return () => window.removeEventListener("a01-legal", on);
  }, []);

  useEffect(() => {
    if (!doc) return;
    const onKey = (e) => e.key === "Escape" && setDoc(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [doc]);

  if (!doc) return null;
  const d = t.legal[doc];

  return (
    <div
      className="legal"
      role="dialog"
      aria-modal="true"
      aria-label={d.title}
      onClick={(e) => { if (e.target.classList.contains("legal")) setDoc(null); }}
    >
      <div className="legal__panel">
        <button className="legal__close" aria-label={t.legal.close} onClick={() => setDoc(null)}>✕</button>
        <h3>{d.title}</h3>
        <p className="legal__updated">{t.legal.updated}</p>
        {d.body.map((p, i) => <p key={i} className="legal__p">{p}</p>)}
      </div>
    </div>
  );
}
