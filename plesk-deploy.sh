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

# Plesk's deploy environment sometimes lacks npm on PATH. If so, find the
# Node bundled with Plesk and use it.
if ! command -v npm >/dev/null 2>&1; then
  for d in /opt/plesk/node/*/bin; do
    if [ -x "$d/npm" ]; then export PATH="$d:$PATH"; fi
  done
fi

echo "[deploy] node: $(command -v node || echo 'not found')  npm: $(command -v npm || echo 'not found')"

echo "[deploy] installing dependencies (npm ci)"
npm ci

echo "[deploy] building (npm run build)"
npm run build

# Passenger restarts the app when this file's mtime changes.
echo "[deploy] restarting Node app"
mkdir -p tmp
touch tmp/restart.txt

echo "[deploy] done — dist/ rebuilt and app restarted"
