#!/usr/bin/env bash
# Prepare hybrid Capacitor native projects (remote Netlify URL in capacitor.config.ts).
# Usage: ./scripts/codemagic-hybrid-capacitor.sh <app_root> <ios|android|both>
set -exuo pipefail

APP_ROOT="${1:?app root required}"
PLATFORM="${2:-both}"

cd "$APP_ROOT"

# Match Play Console package names (com.chrissims.*) when set in Codemagic vars.
if [ -n "${PACKAGE_NAME:-}" ]; then
  export CAPACITOR_APP_ID="$PACKAGE_NAME"
fi

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

if npm run | grep -q '\bcheck\b'; then
  npm run check
else
  npm run build
fi

if [ ! -d capacitor-web ]; then
  echo "ERROR: capacitor-web/ missing in $APP_ROOT"
  exit 1
fi

if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  [ -d ios ] || npx cap add ios
  npx cap sync ios
  if [ -d ios/App ]; then
    (cd ios/App && pod install)
  fi
fi

if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  [ -d android ] || npx cap add android
  npx cap sync android
fi
