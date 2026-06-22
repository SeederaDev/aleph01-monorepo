# aleph0I — landing

Marketing landing page for **aleph0I (A0I)** — agnostic AI & cloud orchestration (product: **matchoice / mtx**).

## Stack
- **React 18** + **Vite 5**
- **three.js** for the hero tesseract and the spotlight radar
- Bilingual **EN / IT** (lightweight context-based i18n, persisted)
- GDPR-compliant cookie consent + privacy/cookie policy modals
- SEO: per-language `<title>`/meta + Open Graph/Twitter + JSON-LD

## Develop
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the build
```

## Structure
```
src/
  App.jsx                 # shell: Header + Content + Footer + overlays
  i18n.jsx                # EN/IT dictionary + LangProvider/useT
  components/
    Header.jsx Footer.jsx Content.jsx
    CookieBanner.jsx LegalModal.jsx
    Hero3D.jsx            # three.js tesseract (hero)
    SpotlightScene.jsx    # three.js radar (use-case spotlight)
    sections/             # one component per page section
  lib/
    ui.jsx                # shared helpers (Lines, Bolt, SectionHead, useReveal)
    useSeo.jsx  consent.js
public/img/               # logo + favicon
```

To re-compose the page, edit `defaultSections` in `src/components/Content.jsx`.

## Notes
- Brand colour is intentionally monochrome (black/white); the accent token lives in `--orange` in `src/styles.css`.
- Working artifacts and the original company/investor decks are intentionally **excluded** from the repo (see `.gitignore`).
- Legal copy (privacy / cookie policy) is a template — have it reviewed before going live.
