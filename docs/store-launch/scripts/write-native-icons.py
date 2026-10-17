"""
Write store icon-1024.png into native app icon slots (same as last FishCrew/ShutterBid wrap).

Targets:
  - assets/app-icon.png (iOS wrappers + hybrid Codemagic injection source)
  - Android mipmap ic_launcher / round / foreground
  - Downloads/app_icons_ready (1024 + marketing AppIcon.appiconset)
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(r"C:\Users\draco\Downloads\MackSims")
ASC = ROOT / "docs" / "store-launch" / "app-store-assets"
READY = Path(r"C:\Users\draco\Downloads\app_icons_ready")
BG = (8, 12, 20)

LAUNCHER = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}
FOREGROUND = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}

CONTENTS_MARKETING = {
    "images": [
        {
            "idiom": "ios-marketing",
            "size": "1024x1024",
            "scale": "1x",
            "filename": "AppIcon-1024.png",
        }
    ],
    "info": {"author": "xcode", "version": 1},
}

# app_key -> list of write destinations
IOS_APP_ICON: list[tuple[str, Path]] = [
    ("fishcrew", ROOT / "apps" / "FishCrew" / "fishcrew-ios" / "assets" / "app-icon.png"),
    ("shutterbid", ROOT / "apps" / "ShutterBid" / "shutterbid-ios" / "assets" / "app-icon.png"),
    (
        "shutterbid",
        ROOT
        / "_archive"
        / "imports"
        / "shutterbid"
        / "shutterbid-ios-github"
        / "assets"
        / "app-icon.png",
    ),
    ("curbcue", ROOT / "apps" / "FairShare" / "assets" / "app-icon.png"),
    ("motocrew", ROOT / "apps" / "MotoCrew" / "assets" / "app-icon.png"),
    (
        "coachcore",
        ROOT / "apps" / "CoachCore" / "coachcore-static-v001" / "assets" / "app-icon.png",
    ),
    ("sermonstudio", ROOT / "apps" / "SermonStudio" / "assets" / "app-icon.png"),
]

ANDROID_RES: list[tuple[str, Path]] = [
    ("curbcue", ROOT / "apps" / "FairShare" / "android" / "app" / "src" / "main" / "res"),
    ("motocrew", ROOT / "apps" / "MotoCrew" / "android" / "app" / "src" / "main" / "res"),
    ("sermonstudio", ROOT / "apps" / "SermonStudio" / "android" / "app" / "src" / "main" / "res"),
    (
        "coachcore",
        ROOT
        / "apps"
        / "CoachCore"
        / "coachcore-static-v001"
        / "android"
        / "app"
        / "src"
        / "main"
        / "res",
    ),
]

READY_APPS = [
    ("fishcrew", "FishCrew"),
    ("shutterbid", "ShutterBid"),
    ("curbcue", "CurbCue"),
    ("motocrew", "MotoCrew"),
    ("coachcore", "CoachCore"),
    ("sermonstudio", "SermonStudio"),
]


def load_rgb(app: str) -> Image.Image:
    path = ASC / app / "icon-1024.png"
    if not path.exists():
        raise FileNotFoundError(path)
    img = Image.open(path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    if img.size != (1024, 1024):
        img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
    return img


def save_png(img: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "PNG", optimize=True)
    print(f"  wrote {dest} ({img.size[0]}x{img.size[1]} {img.mode})")


def resize_rgb(src: Image.Image, size: int) -> Image.Image:
    return src.resize((size, size), Image.Resampling.LANCZOS)


def adaptive_foreground(src: Image.Image, size: int) -> Image.Image:
    """Center opaque mark at ~66% of adaptive canvas (safe zone)."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    content = int(round(size * (72 / 108)))
    mark = src.resize((content, content), Image.Resampling.LANCZOS).convert("RGBA")
    offset = (size - content) // 2
    canvas.paste(mark, (offset, offset))
    return canvas


def write_android(app: str, res: Path, src: Image.Image) -> None:
    if not res.is_dir():
        print(f"  SKIP missing android res {res}")
        return
    for folder, size in LAUNCHER.items():
        slot = res / folder
        if not slot.is_dir():
            continue
        rgba = resize_rgb(src, size).convert("RGBA")
        for name in ("ic_launcher.png", "ic_launcher_round.png"):
            save_png(rgba, slot / name)
        fg_size = FOREGROUND[folder]
        fg = adaptive_foreground(src, fg_size)
        save_png(fg, slot / "ic_launcher_foreground.png")


def write_ready_pack(app: str, label: str, src: Image.Image) -> None:
    READY.mkdir(parents=True, exist_ok=True)
    png_name = f"{app}_app_icon_1024.png"
    save_png(src, READY / png_name)
    iconset = READY / f"{label}_AppIcon.appiconset"
    if iconset.exists():
        shutil.rmtree(iconset)
    iconset.mkdir(parents=True)
    save_png(src, iconset / "AppIcon-1024.png")
    (iconset / "Contents.json").write_text(
        json.dumps(CONTENTS_MARKETING, indent=2) + "\n", encoding="utf-8"
    )
    print(f"  ready pack {label}")


def write_ready_readme() -> None:
    lines = [
        "App icon files generated from current Aegis-family store exports.",
        "",
        "Files:",
    ]
    for app, label in READY_APPS:
        lines.append(f"- {app}_app_icon_1024.png")
        lines.append(f"- {label}_AppIcon.appiconset/")
    lines.extend(
        [
            "",
            "Notes:",
            "- PNG files are 1024x1024 RGB with no transparency.",
            "- iOS automatically rounds app icon corners.",
            "- For wrapper / hybrid repos, place each PNG here:",
            "  assets/app-icon.png",
            "",
            "Wrapper / hybrid targets:",
            "- FishCrew: apps/FishCrew/fishcrew-ios/assets/app-icon.png",
            "- ShutterBid: apps/ShutterBid/shutterbid-ios/assets/app-icon.png",
            "- CurbCue: apps/FairShare/assets/app-icon.png",
            "- MotoCrew: apps/MotoCrew/assets/app-icon.png",
            "- CoachCore: apps/CoachCore/coachcore-static-v001/assets/app-icon.png",
            "- Sermon Studio: apps/SermonStudio/assets/app-icon.png",
            "",
        ]
    )
    (READY / "README_icons.txt").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    by_app: dict[str, Image.Image] = {}
    for app, _ in READY_APPS:
        by_app[app] = load_rgb(app)

    print("iOS / assets/app-icon.png")
    for app, dest in IOS_APP_ICON:
        save_png(by_app[app], dest)

    print("Android mipmaps")
    for app, res in ANDROID_RES:
        print(f"  [{app}]")
        write_android(app, res, by_app[app])

    print("app_icons_ready")
    for app, label in READY_APPS:
        write_ready_pack(app, label, by_app[app])
    write_ready_readme()
    print("done")


if __name__ == "__main__":
    main()
