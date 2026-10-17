#!/usr/bin/env python3
"""Prepare base64 chunk files for Play Console DataTransfer CSV injection."""
from __future__ import annotations

import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CHUNK = 3500

APPS = [
    "aegis",
    "curbcue",
    "throttlelink",
    "coachcore",
    "sermonstudio",
    "fishcrew",
    "shutterbid",
]


def main() -> None:
    for key in APPS:
        slim = ROOT / f"data_safety_{key}_slim.csv"
        if not slim.exists():
            print("MISSING", slim)
            continue
        b64 = base64.b64encode(slim.read_bytes()).decode("ascii")
        out = ROOT / "_inject_chunks" / f"{key}_b64"
        out.mkdir(parents=True, exist_ok=True)
        parts = [b64[i : i + CHUNK] for i in range(0, len(b64), CHUNK)]
        for i, p in enumerate(parts):
            (out / f"p{i}.txt").write_text(p, encoding="ascii")
        (out / "meta.txt").write_text(f"{len(parts)}\n{slim.name}\n{len(b64)}\n", encoding="utf-8")
        print(key, "parts", len(parts), "b64", len(b64))


if __name__ == "__main__":
    main()
