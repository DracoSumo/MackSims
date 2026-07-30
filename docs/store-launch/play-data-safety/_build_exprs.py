#!/usr/bin/env python3
"""Build per-app Runtime.evaluate expressions that attach slim CSVs to file inputs."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_inject_chunks" / "exprs"
OUT.mkdir(parents=True, exist_ok=True)

APPS = [
    "aegis",
    "curbcue",
    "throttlelink",
    "coachcore",
    "sermonstudio",
    "fishcrew",
    "shutterbid",
]


def expr_for(key: str) -> str:
    text = (ROOT / f"data_safety_{key}_slim.csv").read_text(encoding="utf-8")
    name = f"data_safety_{key}.csv"
    return (
        "(async function(){"
        f"const text={json.dumps(text)};"
        f'const file=new File([text],{json.dumps(name)},{{type:"text/csv"}});'
        'const input=document.querySelector("input[type=file]");'
        'if(!input) return "no-input";'
        "const dt=new DataTransfer();"
        "dt.items.add(file);"
        "input.files=dt.files;"
        'input.dispatchEvent(new Event("input",{bubbles:true}));'
        'input.dispatchEvent(new Event("change",{bubbles:true}));'
        "return {ok:true,bytes:text.length,name:input.files[0].name};"
        "})()"
    )


def main() -> None:
    for key in APPS:
        e = expr_for(key)
        path = OUT / f"{key}.js"
        path.write_text(e, encoding="utf-8")
        print(key, len(e))


if __name__ == "__main__":
    main()
