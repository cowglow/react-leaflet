#!/usr/bin/env bash
# Ensures a locally-trusted HTTPS certificate exists for the Vite dev server, so
# browsers treat https://localhost:3000 as fully secure - no click-through
# warning, and no permission (geolocation, etc.) getting reset because the
# self-signed cert changed on the last restart. Safe to re-run: skips work
# that's already done. See vite.config.ts for how the result gets used.
set -euo pipefail

CERT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/cert"
CERT_FILE="$CERT_DIR/localhost.pem"
KEY_FILE="$CERT_DIR/localhost-key.pem"

if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
  exit 0
fi

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert is not installed - falling back to vite-plugin-basic-ssl's untrusted cert." >&2
  echo "For a trusted cert (recommended), install mkcert first:" >&2
  echo "  macOS:   brew install mkcert" >&2
  echo "  other:   https://github.com/FiloSottile/mkcert#installation" >&2
  exit 0
fi

mkdir -p "$CERT_DIR"

# Installs mkcert's local CA into the OS/browser trust stores. Idempotent - a
# no-op if already installed (as it likely already is on this machine).
mkcert -install

mkcert -cert-file "$CERT_FILE" -key-file "$KEY_FILE" localhost 127.0.0.1 ::1

echo "Dev HTTPS certificate ready at $CERT_DIR"
