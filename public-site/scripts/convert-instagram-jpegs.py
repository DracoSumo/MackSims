from PIL import Image
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
roots = [
    ROOT / "docs/social-assets/instagram-launch/01-welcome",
    ROOT / "docs/social-assets/instagram-launch/02-lineup",
    ROOT / "docs/social-assets/instagram-launch/03-help-shape-apps",
]
out_base = ROOT / "public-site/public/social/instagram"
mapping = {
    "01-welcome": "welcome",
    "02-lineup": "lineup",
    "03-help-shape-apps": "help-shape-apps",
}
results = []
for root in roots:
    dest = out_base / mapping[root.name]
    dest.mkdir(parents=True, exist_ok=True)
    for png in sorted(root.glob("*.png")):
        img = Image.open(png)
        if img.mode in ("RGBA", "LA"):
            bg = Image.new("RGB", img.size, (7, 6, 12))
            bg.paste(img, mask=img.split()[-1])
            rgb = bg
        else:
            rgb = img.convert("RGB")
        if rgb.size != (1080, 1350):
            rgb = rgb.resize((1080, 1350), Image.Resampling.LANCZOS)
        out = dest / f"{png.stem}.jpg"
        save_kwargs = {
            "format": "JPEG",
            "quality": 92,
            "optimize": True,
            "progressive": True,
            "subsampling": 1,
        }
        icc = img.info.get("icc_profile")
        if icc:
            save_kwargs["icc_profile"] = icc
        rgb.save(out, **save_kwargs)
        size = out.stat().st_size
        verify = Image.open(out)
        results.append(
            {
                "src": str(png.relative_to(ROOT)).replace("\\", "/"),
                "out": str(out.relative_to(ROOT)).replace("\\", "/"),
                "bytes": size,
                "size": list(verify.size),
                "mode": verify.mode,
                "under_8mb": size < 8 * 1024 * 1024,
            }
        )
print(json.dumps(results, indent=2))
