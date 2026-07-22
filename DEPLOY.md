# Deploy — aleph01.com

The site is a static **Vite** build. It is **built by GitHub Actions**, never on
the server (the VPS's Plesk deploy shell is a restricted/chroot environment where
Node isn't usable). Plesk only serves the already-built static files.

## How it works

```
push to main
   │
   ▼
GitHub Actions (.github/workflows/deploy.yml)
   • npm ci && npm run build
   • force-push dist/ ➜ the `production` branch (built files at repo root)
   │
   ▼
Plesk Git deploys the `production` branch ➜ /httpdocs  (static, no build)
   │
   ▼
nginx serves https://aleph01.com
```

- **`main`** = source code. Edit here.
- **`production`** = build output only (auto-generated — never edit or commit to
  it by hand; the Action force-pushes it every time).

## Daily changes

```bash
# edit src/…, then:
git add -A && git commit -m "…" && git push origin main
```

That's the whole flow. The Action rebuilds, updates `production`, Plesk pulls and
publishes. No manual build, no moving files.

Watch a run at **GitHub → Actions → "Build & publish to production branch"**.
`workflow_dispatch` is enabled, so you can also trigger it by hand from that page.

## Plesk configuration (one-time)

**Git → repository Settings**
- **Repository branch**: `production`
- **Server path**: `/httpdocs`
- **Deployment mode**: Automatic
- **Additional deployment actions**: **disabled** (nothing runs on the server)

**Hosting & DNS → Hosting Settings**
- **Document root**: `/httpdocs`

The GitHub webhook Plesk shows must be registered on the repo so a push to
`production` triggers a pull. (If deploys ever lag, use **Pull now → Deploy now**
on the Git page.)

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # preview the build locally
```

## Notes

- `dist/` is git-ignored on `main` — it only ever lives on the `production`
  branch, published by the Action.
- Hiding/showing page sections is done in `src/components/Content.jsx`
  (`defaultSections`) — just edit and push.
- To change the Node version used for builds, edit `node-version` in
  `.github/workflows/deploy.yml`.
