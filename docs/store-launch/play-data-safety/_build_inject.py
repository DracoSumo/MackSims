#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
text = (ROOT / "data_safety_aegis_slim.csv").read_text(encoding="utf-8")
expr = (
    "(async function(){"
    f"const text={json.dumps(text)};"
    'const file=new File([text],"data_safety_aegis.csv",{type:"text/csv"});'
    'const input=document.querySelector("input[type=file]");'
    'if(!input) return "no-input";'
    "const dt=new DataTransfer();"
    "dt.items.add(file);"
    "input.files=dt.files;"
    'input.dispatchEvent(new Event("input",{bubbles:true}));'
    'input.dispatchEvent(new Event("change",{bubbles:true}));'
    "return {ok:true,bytes:text.length,n:input.files.length,name:input.files[0].name};"
    "})()"
)
out = ROOT / "_inject_chunks" / "inject_slim.js"
out.write_text(expr, encoding="utf-8")
print(out, len(expr))
