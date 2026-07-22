/**
 * start.js — production static server for the built landing page.
 *
 * Serves the Vite build output in ./dist over HTTP with correct MIME types
 * and an SPA fallback to index.html. Zero dependencies (Node core only), so
 * nothing extra to install on the VPS.
 *
 * Run:   node start.js
 * Port:  reads PORT from the environment (Plesk/Passenger set this),
 *        falls back to 3000. PORT may also be a unix socket path — Node's
 *        server.listen() handles both a number and a path string.
 *
 * Typical deploy on the VPS:
 *   git pull
 *   npm ci
 *   npm run build      # regenerates ./dist
 *   node start.js      # (or restart the Plesk Node app)
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
};

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error(
    `[start] Missing build output at ${DIST}\n` +
      `        Run "npm run build" first, then start this server.`
  );
  process.exit(1);
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  // Cache hashed assets aggressively; keep HTML uncached so deploys show up.
  const cache = ext === ".html"
    ? "no-cache"
    : "public, max-age=31536000, immutable";
  const stream = fs.createReadStream(filePath);
  stream.on("open", () =>
    res.writeHead(200, { "Content-Type": type, "Cache-Control": cache })
  );
  stream.on("error", () => send(res, 500, "Internal Server Error"));
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  // Only GET/HEAD for a static site.
  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(res, 405, "Method Not Allowed", { Allow: "GET, HEAD" });
  }

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  // Resolve inside DIST and block path traversal.
  const resolved = path.normalize(path.join(DIST, urlPath));
  if (resolved !== DIST && !resolved.startsWith(DIST + path.sep)) {
    return send(res, 403, "Forbidden");
  }

  let filePath = resolved;
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, "index.html");
  } catch {
    // Not found: fall back to index.html for extensionless routes (SPA),
    // otherwise 404 for genuinely missing assets.
    if (path.extname(urlPath) === "") {
      filePath = path.join(DIST, "index.html");
    } else {
      return send(res, 404, "Not Found");
    }
  }

  if (!fs.existsSync(filePath)) return send(res, 404, "Not Found");
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`[start] Serving ${DIST}`);
  console.log(`[start] Listening on ${typeof PORT === "number" ? `http://localhost:${PORT}` : PORT}`);
});
