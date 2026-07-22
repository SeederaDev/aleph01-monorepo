#!/usr/bin/env bash
#
# plesk-deploy.sh — entry point for Plesk Git "Additional deployment actions".
#
# Plesk pulls the repo on every push; this script rebuilds the static site and
# restarts the Passenger Node app. Point Plesk's deploy actions at:
#
#     bash plesk-deploy.sh
#
# Manual use on the VPS works too: `bash plesk-deploy.sh`.

set -euo pipefail
cd "$(dirname "$0")"

# Plesk's deploy shell often has no npm on PATH (and its login profile may print
# "nodenv: command not found"). Probe the common Node installs until npm resolves.
if ! command -v npm >/dev/null 2>&1; then
  # 1) Node bundled with the Plesk Node.js extension
  for d in /opt/plesk/node/*/bin; do
    [ -x "$d/npm" ] && export PATH="$d:$PATH"
  done
fi
if ! command -v npm >/dev/null 2>&1; then
  # 2) nodenv (per-user version manager) — this server uses it
  export NODENV_ROOT="${NODENV_ROOT:-$HOME/.nodenv}"
  export PATH="$NODENV_ROOT/shims:$NODENV_ROOT/bin:$PATH"
  command -v nodenv >/dev/null 2>&1 && eval "$(nodenv init - 2>/dev/null)" || true
fi
if ! command -v npm >/dev/null 2>&1; then
  # 3) nvm
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1090
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1 || true
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[deploy] ERROR: npm not found on PATH." >&2
  echo "[deploy] Find it on the server with:  which npm  ||  ls -d /opt/plesk/node/*/bin ~/.nodenv/shims 2>/dev/null" >&2
  echo "[deploy] then add its dir here, e.g.:  export PATH=/path/to/node/bin:\$PATH" >&2
  exit 1
fi

echo "[deploy] node: $(command -v node || echo 'not found')  npm: $(command -v npm || echo 'not found')"

echo "[deploy] installing dependencies (npm ci --include=dev)"
# --include=dev: Vite is a devDependency; Plesk may run with NODE_ENV=production,
# which would otherwise skip it and break the build (vite: not found).
npm ci --include=dev

echo "[deploy] building (npm run build)"
npm run build

# Passenger restarts the app when this file's mtime changes.
echo "[deploy] restarting Node app"
mkdir -p tmp
touch tmp/restart.txt

echo "[deploy] done — dist/ rebuilt and app restarted"
