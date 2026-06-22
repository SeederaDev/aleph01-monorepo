import { useEffect, useState } from "react";
import { useT } from "../i18n.jsx";

/* Language switch (EN / IT) — reused in the bar and the mobile menu */
export function LangToggle({ className = "" }) {
  const { lang, setLang } = useT();
  return (
    <div className={`langtoggle ${className}`} role="group" aria-label="Language">
      <button className={lang === "en" ? "is-on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
      <span aria-hidden="true">/</span>
      <button className={lang === "it" ? "is-on" : ""} onClick={() => setLang("it")} aria-pressed={lang === "it"}>IT</button>
    </div>
  );
}

/* A nav entry, optionally with a hover/focus dropdown */
function NavItem({ label, items, href }) {
  return (
    <div className="nav__item">
      <a href={href || "#"} className={`nav__link ${items ? "nav__link--has-menu" : ""}`}>{label}</a>
      {items && (
        <div className="nav__menu" role="menu">
          {items.map((it) => (
            <a key={it.l} href={it.h} role="menuitem">{it.l}</a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const mobileLinks = [
    { l: t.nav.platform, h: "#matchoice" },
    { l: t.nav.solutions, h: "#solutions" },
    { l: t.nav.learn, h: "#research" },
    { l: t.nav.developers, h: "#code" },
    { l: t.nav.about, h: "#about" },
  ];

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav__inner">
          <nav className="nav__group nav__group--left" aria-label="Primary">
            <NavItem label={t.nav.platform} items={t.nav.menu.platform} />
            <NavItem label={t.nav.solutions} items={t.nav.menu.solutions} />
            <NavItem label={t.nav.learn} items={t.nav.menu.learn} />
            <NavItem label={t.nav.about} href="#about" />
          </nav>

          <a href="#top" className="brand" aria-label="aleph0I home">
            <img className="brand__logo" src="/img/logo-favi.png" alt="aleph0I" width="30" height="30" />
          </a>

          <div className="nav__group nav__group--right">
            <NavItem label={t.nav.developers} items={t.nav.menu.developers} />
            <LangToggle />
            <a href="#contact" className="btn btn--primary btn--sm">{t.nav.cta}</a>
          </div>

          <button
            className={`nav__burger ${open ? "open" : ""}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${open ? "open" : ""}`} aria-hidden={!open}>
        {mobileLinks.map((l) => (
          <a key={l.l} href={l.h} className="mobile-nav__link" onClick={() => setOpen(false)}>{l.l}</a>
        ))}
        <LangToggle className="langtoggle--mobile" />
        <a href="#contact" className="btn btn--primary mobile-nav__cta" onClick={() => setOpen(false)}>{t.nav.cta}</a>
      </div>
    </>
  );
}
