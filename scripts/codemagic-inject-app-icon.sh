#!/usr/bin/env bash
# Inject assets/app-icon.png (1024×1024) into Capacitor iOS AppIcon + Android mipmaps.
# Usage: ./scripts/codemagic-inject-app-icon.sh <app_root> [ios|android|both]
# Optional env:
#   STORE_ICON_KEY  — if set, copy docs/store-launch/app-store-assets/$STORE_ICON_KEY/icon-1024.png
#                     into <app_root>/assets/app-icon.png first (MackSims monorepo builds).
#   ICON_SRC        — override source PNG path
set -euo pipefail

APP_ROOT="${1:?app root required}"
PLATFORM="${2:-both}"

if [ ! -d "$APP_ROOT" ]; then
  echo "ERROR: app root not found: $APP_ROOT"
  exit 1
fi

cd "$APP_ROOT"

# Prefer monorepo store asset when building from MackSims Codemagic.
if [ -n "${STORE_ICON_KEY:-}" ]; then
  REPO_ROOT="${CM_BUILD_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
  STORE_ICON="$REPO_ROOT/docs/store-launch/app-store-assets/${STORE_ICON_KEY}/icon-1024.png"
  if [ -f "$STORE_ICON" ]; then
    mkdir -p assets
    cp "$STORE_ICON" assets/app-icon.png
    echo "Copied store icon $STORE_ICON → assets/app-icon.png"
  else
    echo "WARN: STORE_ICON_KEY=$STORE_ICON_KEY but missing $STORE_ICON"
  fi
fi

ICON_SRC="${ICON_SRC:-assets/app-icon.png}"
if [ ! -f "$ICON_SRC" ]; then
  echo "No $ICON_SRC — skipping app icon injection"
  exit 0
fi

if ! command -v sips >/dev/null 2>&1; then
  echo "ERROR: sips required (macOS Codemagic runners)"
  exit 1
fi

inject_ios() {
  local ICONSET="ios/App/App/Assets.xcassets/AppIcon.appiconset"
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
  "info": { "version": 1, "author": "codemagic-inject-app-icon" }
}
EOF
  echo "Injected iOS AppIcon from $ICON_SRC"
}

inject_android() {
  local RES="android/app/src/main/res"
  if [ ! -d "$RES" ]; then
    echo "No Android res/ — skipping launcher icon injection"
    return 0
  fi

  # Density → launcher size, adaptive foreground size
  local dens sizes fg
  for dens in mdpi:48:108 hdpi:72:162 xhdpi:96:216 xxhdpi:144:324 xxxhdpi:192:432; do
    IFS=':' read -r name size fg <<< "$dens"
    local slot="$RES/mipmap-$name"
    mkdir -p "$slot"
    sips -z "$size" "$size" "$ICON_SRC" --out "$slot/ic_launcher.png" >/dev/null
    sips -z "$size" "$size" "$ICON_SRC" --out "$slot/ic_launcher_round.png" >/dev/null
    sips -z "$fg" "$fg" "$ICON_SRC" --out "$slot/ic_launcher_foreground.png" >/dev/null
  done
  echo "Injected Android launcher icons from $ICON_SRC"
}

if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  inject_ios
fi
if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  inject_android
fi
