import { useT } from "../i18n.jsx";
import { openConsent, openLegal } from "../lib/consent.js";

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="footer">
      <div className="container">
        <a href="#top" className="brand brand--footer" aria-label="aleph0i home">
          <img className="brand__logo brand__logo--full" src="/img/logo.png" alt="aleph0i" width="180" height="246" />
        </a>
        <p className="footer__tagline">{t.footer.tagline}<br />{t.footer.tagline2}</p>

        <div className="footer__cols">
          {t.footer.cols.map((c) => (
            <div className="footer__col" key={c.h}>
              <h4>{c.h}</h4>
              {c.links.map((l) => <a href="#" key={l}>{l}</a>)}
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">
            <span>{t.footer.rights}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal("privacy"); }}>{t.legal.privacy.title}</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal("cookie"); }}>{t.legal.cookie.title}</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openConsent(); }}>{t.cookie.manage}</a>
          </p>
          <div className="footer__social" aria-label="Social">
            <a href="#" aria-label="X">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="GitHub">◆</a>
            <a href="#" aria-label="Email">@</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
