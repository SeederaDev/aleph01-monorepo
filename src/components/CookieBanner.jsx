import { useEffect, useState } from "react";
import { useT } from "../i18n.jsx";
import { getConsent, saveConsent, openLegal } from "../lib/consent.js";

/* GDPR-compliant consent bar: equal Accept/Reject prominence, granular
   categories (necessary always on), reopenable via "Manage cookies". */
export default function CookieBanner() {
  const { t } = useT();
  const c = t.cookie;
  const [open, setOpen] = useState(() => !getConsent());
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const reopen = () => {
      const cur = getConsent();
      setAnalytics(!!cur?.analytics);
      setMarketing(!!cur?.marketing);
      setPrefs(true);
      setOpen(true);
    };
    window.addEventListener("a01-consent-open", reopen);
    return () => window.removeEventListener("a01-consent-open", reopen);
  }, []);

  if (!open) return null;
  const finish = (cfg) => {
    saveConsent(cfg);
    setOpen(false);
    setPrefs(false);
  };

  return (
    <aside className="cookie" role="dialog" aria-label={c.title}>
      <h5>{c.title}</h5>

      {!prefs ? (
        <>
          <p>
            {c.body}{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal("cookie"); }}>{c.policy}</a>.
          </p>
          <div className="cookie__row">
            <button className="btn btn--dark btn--sm" onClick={() => finish({ analytics: true, marketing: true })}>{c.accept}</button>
            <button className="btn btn--ghost btn--sm" onClick={() => finish({ analytics: false, marketing: false })}>{c.reject}</button>
          </div>
          <button className="cookie__custom" onClick={() => setPrefs(true)}>{c.customize}</button>
        </>
      ) : (
        <>
          <div className="cookie__cats">
            <div className="cookie__cat">
              <span><b>{c.cats.necessary.name}</b><small>{c.cats.necessary.note}</small></span>
              <span className="cookie__always">{c.cats.necessary.always}</span>
            </div>
            <label className="cookie__cat">
              <span><b>{c.cats.analytics.name}</b><small>{c.cats.analytics.note}</small></span>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            </label>
            <label className="cookie__cat">
              <span><b>{c.cats.marketing.name}</b><small>{c.cats.marketing.note}</small></span>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            </label>
          </div>
          <div className="cookie__row">
            <button className="btn btn--dark btn--sm" onClick={() => finish({ analytics, marketing })}>{c.save}</button>
            <button className="btn btn--ghost btn--sm" onClick={() => finish({ analytics: true, marketing: true })}>{c.accept}</button>
          </div>
        </>
      )}
    </aside>
  );
}
