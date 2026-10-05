#!/usr/bin/env bash
set -eu

PORT="${PORT:-8787}"
LOG="/tmp/dod-audio.log"

cd "${GITHUB_WORKSPACE:-/workspaces/desert-of-desolation}/audio-renderer"
if ! pgrep -f "node server.js" >/dev/null 2>&1; then
  nohup npm start >"${LOG}" 2>&1 &
fi

for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if curl --fail --silent "http://127.0.0.1:${PORT}/healthz" >/dev/null; then
    break
  fi
  sleep 1
done
curl --fail --silent "http://127.0.0.1:${PORT}/healthz" >/dev/null

if [ -n "${CODESPACE_NAME:-}" ]; then
  gh codespace ports visibility "${PORT}:public" -c "${CODESPACE_NAME}" >/dev/null 2>&1 || true
fi

DOMAIN="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
BASE="https://${CODESPACE_NAME:-unknown}-${PORT}.${DOMAIN}"
MCP="${BASE}/mcp"
HEALTH="${BASE}/healthz"
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "${GITHUB_WORKSPACE:-/workspaces/desert-of-desolation}/runtime"
cat > "${GITHUB_WORKSPACE:-/workspaces/desert-of-desolation}/runtime/codespace-endpoint.json" <<EOF
{
  "codespace": "${CODESPACE_NAME:-unknown}",
  "port": ${PORT},
  "base_url": "${BASE}",
  "mcp_url": "${MCP}",
  "health_url": "${HEALTH}",
  "updated_at": "${NOW}"
}
EOF

cd "${GITHUB_WORKSPACE:-/workspaces/desert-of-desolation}"
if [ -n "${GITHUB_TOKEN:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ]; then
  CONTENT="$(base64 -w 0 runtime/codespace-endpoint.json 2>/dev/null || base64 < runtime/codespace-endpoint.json | tr -d '\n')"
  API="repos/${GITHUB_REPOSITORY}/contents/runtime/codespace-endpoint.json"
  SHA="$(gh api "${API}" --jq .sha 2>/dev/null || true)"
  if [ -n "${SHA}" ]; then
    gh api --method PUT "${API}" -f message="Update live Codespaces MCP endpoint" -f content="${CONTENT}" -f sha="${SHA}" >/dev/null
  else
    gh api --method PUT "${API}" -f message="Publish live Codespaces MCP endpoint" -f content="${CONTENT}" >/dev/null
  fi
fi

printf 'Desert of Desolation audio renderer is healthy.\n'
printf 'MCP endpoint: %s\n' "${MCP}"
printf 'Health endpoint: %s\n' "${HEALTH}"
