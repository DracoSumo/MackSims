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

inject_ios_app_icon() {
  local ICON_SRC="assets/app-icon.png"
  local ICONSET="ios/App/App/Assets.xcassets/AppIcon.appiconset"

  if [ ! -f "$ICON_SRC" ]; then
    echo "No $ICON_SRC — skipping AppIcon injection"
    return 0
  fi
  if [ ! -d "ios/App/App/Assets.xcassets" ]; then
    echo "No iOS Assets.xcassets — skipping AppIcon injection"
    return 0
  fi

  rm -rf "$ICONSET"
  mkdir -p "$ICONSET"

  make_icon() {
    local size="$1"
    local name="$2"
    sips -z "$size" "$size" "$ICON_SRC" --out "$ICONSET/$name" >/dev/null
  }

  make_icon 40 Icon-App-20x20@2x.png
  make_icon 60 Icon-App-20x20@3x.png
  make_icon 58 Icon-App-29x29@2x.png
  make_icon 87 Icon-App-29x29@3x.png
  make_icon 80 Icon-App-40x40@2x.png
  make_icon 120 Icon-App-40x40@3x.png
  make_icon 120 Icon-App-60x60@2x.png
  make_icon 180 Icon-App-60x60@3x.png
  make_icon 20 Icon-App-20x20@1x-ipad.png
  make_icon 40 Icon-App-20x20@2x-ipad.png
  make_icon 29 Icon-App-29x29@1x-ipad.png
  make_icon 58 Icon-App-29x29@2x-ipad.png
  make_icon 40 Icon-App-40x40@1x-ipad.png
  make_icon 80 Icon-App-40x40@2x-ipad.png
  make_icon 76 Icon-App-76x76@1x-ipad.png
  make_icon 152 Icon-App-76x76@2x-ipad.png
  make_icon 167 Icon-App-83.5x83.5@2x-ipad.png
  make_icon 1024 ItunesArtwork-1024.png

  cat > "$ICONSET/Contents.json" <<'EOF'
{
  "images": [
    { "size": "20x20", "idiom": "iphone", "filename": "Icon-App-20x20@2x.png", "scale": "2x" },
    { "size": "20x20", "idiom": "iphone", "filename": "Icon-App-20x20@3x.png", "scale": "3x" },
    { "size": "29x29", "idiom": "iphone", "filename": "Icon-App-29x29@2x.png", "scale": "2x" },
    { "size": "29x29", "idiom": "iphone", "filename": "Icon-App-29x29@3x.png", "scale": "3x" },
    { "size": "40x40", "idiom": "iphone", "filename": "Icon-App-40x40@2x.png", "scale": "2x" },
    { "size": "40x40", "idiom": "iphone", "filename": "Icon-App-40x40@3x.png", "scale": "3x" },
    { "size": "60x60", "idiom": "iphone", "filename": "Icon-App-60x60@2x.png", "scale": "2x" },
    { "size": "60x60", "idiom": "iphone", "filename": "Icon-App-60x60@3x.png", "scale": "3x" },
    { "size": "20x20", "idiom": "ipad", "filename": "Icon-App-20x20@1x-ipad.png", "scale": "1x" },
    { "size": "20x20", "idiom": "ipad", "filename": "Icon-App-20x20@2x-ipad.png", "scale": "2x" },
    { "size": "29x29", "idiom": "ipad", "filename": "Icon-App-29x29@1x-ipad.png", "scale": "1x" },
    { "size": "29x29", "idiom": "ipad", "filename": "Icon-App-29x29@2x-ipad.png", "scale": "2x" },
    { "size": "40x40", "idiom": "ipad", "filename": "Icon-App-40x40@1x-ipad.png", "scale": "1x" },
    { "size": "40x40", "idiom": "ipad", "filename": "Icon-App-40x40@2x-ipad.png", "scale": "2x" },
    { "size": "76x76", "idiom": "ipad", "filename": "Icon-App-76x76@1x-ipad.png", "scale": "1x" },
    { "size": "76x76", "idiom": "ipad", "filename": "Icon-App-76x76@2x-ipad.png", "scale": "2x" },
    { "size": "83.5x83.5", "idiom": "ipad", "filename": "Icon-App-83.5x83.5@2x-ipad.png", "scale": "2x" },
    { "size": "1024x1024", "idiom": "ios-marketing", "filename": "ItunesArtwork-1024.png", "scale": "1x" }
  ],
  "info": { "version": 1, "author": "codemagic-hybrid" }
}
EOF
  echo "Injected AppIcon from $ICON_SRC"
}

if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  [ -d ios ] || npx cap add ios
  npx cap sync ios
  inject_ios_app_icon
  if [ -d ios/App ]; then
    (cd ios/App && pod install)
  fi
fi

if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  [ -d android ] || npx cap add android
  npx cap sync android
fi
