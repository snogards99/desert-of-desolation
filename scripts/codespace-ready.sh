#!/usr/bin/env bash
set -eu

PORT="${PORT:-8787}"
HEALTH="http://127.0.0.1:${PORT}/healthz"

printf 'Checking Desert of Desolation audio renderer...\n'
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl --fail --silent "${HEALTH}" >/dev/null; then
    break
  fi
  sleep 1
done

curl --fail --silent "${HEALTH}"
printf '\n'

if [ -n "${CODESPACE_NAME:-}" ] && [ -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]; then
  BASE="https://${CODESPACE_NAME}-${PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  printf 'Codespaces renderer URL: %s\n' "${BASE}"
  printf 'MCP endpoint: %s/mcp\n' "${BASE}"
  printf 'Health endpoint: %s/healthz\n' "${BASE}"
  printf 'If ChatGPT cannot reach it, set forwarded port %s visibility to Public in the Codespaces Ports panel.\n' "${PORT}"
else
  printf 'Renderer is healthy locally on port %s.\n' "${PORT}"
fi
