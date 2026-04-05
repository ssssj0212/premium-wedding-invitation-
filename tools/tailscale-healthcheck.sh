#!/bin/zsh
set -euo pipefail

echo "== Tailscale Healthcheck =="
echo

if [[ -d /Applications/Tailscale.app ]]; then
  echo "[OK] App installed: /Applications/Tailscale.app"
else
  echo "[WARN] App not installed in /Applications"
fi

if pgrep -alf 'Tailscale|tailscaled' >/dev/null 2>&1; then
  echo "[OK] Running processes:"
  pgrep -alf 'Tailscale|tailscaled'
else
  echo "[WARN] No running Tailscale processes found"
fi

CLI_PATH=""
if [[ -x /Applications/Tailscale.app/Contents/MacOS/Tailscale ]]; then
  CLI_PATH="/Applications/Tailscale.app/Contents/MacOS/Tailscale"
elif command -v tailscale >/dev/null 2>&1; then
  CLI_PATH="$(command -v tailscale)"
fi

if [[ -n "$CLI_PATH" ]]; then
  echo
  echo "[OK] CLI found: $CLI_PATH"
  echo
  "$CLI_PATH" version || true
  echo
  "$CLI_PATH" status || true
else
  echo
  echo "[WARN] Tailscale CLI not found yet"
fi

echo
echo "== macOS Launch State =="
launchctl print gui/$(id -u) 2>/dev/null | rg -i 'tailscale' || true
