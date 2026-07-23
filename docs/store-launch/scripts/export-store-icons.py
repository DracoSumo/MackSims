"""
Export store-ready icons the same way as last time:
  docs/store-launch/app-store-assets/<app>/icon-1024.png  (opaque RGB, Apple)
  docs/store-launch/play-assets/<app>/icon-512.png        (Play)
Sources: current Aegis-family product icons on the public site.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image

ROOT = Path(r"C:\Users\draco\Downloads\MackSims")
PRODUCTS = ROOT / "public-site" / "public" / "images" / "products"
ASC = ROOT / "docs" / "store-launch" / "app-store-assets"
PLAY = ROOT / "docs" / "store-launch" / "play-assets"

# folder names match last-time store-launch layout
APPS = [
    ("fishcrew", "fishcrew-icon.png"),
    ("shutterbid", "shutterbid-icon.png"),
    ("curbcue", "curbcue-icon.png"),
    ("motocrew", "motocrew-icon.png"),
    ("coachcore", "coachcore-icon.png"),
    ("sermonstudio", "sermon-studio-icon.png"),
    ("aegisintel", "aegis-intel-icon.png"),
    ("momentpick", "momentpick-icon.png"),
]

# Apple prefers opaque icons; match Aegis charcoal
BG = (8, 12, 20)


def square_rgba(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return img.crop((left, top, left + side, top + side))


def flatten(img: Image.Image, size: int) -> Image.Image:
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), BG)
    canvas.paste(resized, mask=resized.split()[-1])
    return canvas


def main() -> None:
    for folder, src_name in APPS:
        src = PRODUCTS / src_name
        if not src.exists():
            print("SKIP missing source", src_name)
            continue
        base = square_rgba(src)

        apple_dir = ASC / folder
        play_dir = PLAY / folder
        apple_dir.mkdir(parents=True, exist_ok=True)
        play_dir.mkdir(parents=True, exist_ok=True)

        apple = flatten(base, 1024)
        play = flatten(base, 512)
        apple_path = apple_dir / "icon-1024.png"
        play_path = play_dir / "icon-512.png"
        apple.save(apple_path, "PNG", optimize=True)
        play.save(play_path, "PNG", optimize=True)

        # verify mode/size
        a = Image.open(apple_path)
        p = Image.open(play_path)
        print(
            f"{folder:14} apple {a.size} {a.mode} {apple_path.stat().st_size:>8}  "
            f"play {p.size} {p.mode} {play_path.stat().st_size:>8}"
        )

    print("Store PNGs ready. Run write-native-icons.py to push into native slots.")


if __name__ == "__main__":
    main()

