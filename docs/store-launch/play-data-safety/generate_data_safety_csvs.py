#!/usr/bin/env python3
"""Generate Google Play Data Safety import CSVs from a Play Console export template.

Template source: RetroArch-style data_safety_export.csv (Question/Response IDs preserved).
Answers are MackSims-conservative: collected (not shared), no ads, deletion URL live.
"""

from __future__ import annotations

import csv
from copy import deepcopy
from pathlib import Path

TEMPLATE = Path(r"d:\Downloads\RetroArch\data_safety_export.csv")
OUT_DIR = Path(r"C:\Users\draco\Downloads\MackSims\docs\store-launch\play-data-safety")

DELETION_URL = "https://macksims-public-site.netlify.app/account-deletion/"

# Purpose keys used in DATA_USAGE_COLLECTION_PURPOSE / DATA_USAGE_SHARING_PURPOSE
PURPOSE = {
    "func": "PSL_APP_FUNCTIONALITY",
    "analytics": "PSL_ANALYTICS",
    "devcomms": "PSL_DEVELOPER_COMMUNICATIONS",
    "fraud": "PSL_FRAUD_PREVENTION_SECURITY",
    "ads": "PSL_ADVERTISING",
    "personalize": "PSL_PERSONALIZATION",
    "account": "PSL_ACCOUNT_MANAGEMENT",
}

# Data type Response IDs (under PSL_DATA_TYPES_*)
TYPES = {
    "name": ("PSL_DATA_TYPES_PERSONAL", "PSL_NAME"),
    "email": ("PSL_DATA_TYPES_PERSONAL", "PSL_EMAIL"),
    "user_id": ("PSL_DATA_TYPES_PERSONAL", "PSL_USER_ACCOUNT"),
    "approx_location": ("PSL_DATA_TYPES_LOCATION", "PSL_APPROX_LOCATION"),
    "precise_location": ("PSL_DATA_TYPES_LOCATION", "PSL_PRECISE_LOCATION"),
    "photos": ("PSL_DATA_TYPES_PHOTOS_AND_VIDEOS", "PSL_PHOTOS"),
    "videos": ("PSL_DATA_TYPES_PHOTOS_AND_VIDEOS", "PSL_VIDEOS"),
    "other_messages": ("PSL_DATA_TYPES_EMAIL_AND_TEXT", "PSL_OTHER_MESSAGES"),
    "sms": ("PSL_DATA_TYPES_EMAIL_AND_TEXT", "PSL_SMS_CALL_LOG"),
    "fitness": ("PSL_DATA_TYPES_HEALTH_AND_FITNESS", "PSL_FITNESS"),
    "health": ("PSL_DATA_TYPES_HEALTH_AND_FITNESS", "PSL_HEALTH"),
    "crash": ("PSL_DATA_TYPES_APP_PERFORMANCE", "PSL_CRASH_LOGS"),
    "diagnostics": ("PSL_DATA_TYPES_APP_PERFORMANCE", "PSL_PERFORMANCE_DIAGNOSTICS"),
    "other_perf": ("PSL_DATA_TYPES_APP_PERFORMANCE", "PSL_OTHER_PERFORMANCE"),
    "files": ("PSL_DATA_TYPES_FILES_AND_DOCS", "PSL_FILES_AND_DOCS"),
    "interactions": ("PSL_DATA_TYPES_APP_ACTIVITY", "PSL_USER_INTERACTION"),
    "ugc": ("PSL_DATA_TYPES_APP_ACTIVITY", "PSL_USER_GENERATED_CONTENT"),
    "device_id": ("PSL_DATA_TYPES_IDENTIFIERS", "PSL_DEVICE_ID"),
}


def handling(
    collected: bool = True,
    shared: bool = False,
    ephemeral: bool | None = False,
    optional: bool = True,
    purposes: list[str] | None = None,
    share_purposes: list[str] | None = None,
) -> dict:
    return {
        "collected": collected,
        "shared": shared,
        "ephemeral": ephemeral,
        "optional": optional,
        "purposes": purposes or ["func"],
        "share_purposes": share_purposes or [],
    }


# Shared baseline handling profiles
H_ACCOUNT = handling(optional=True, purposes=["func", "account", "fraud"])
H_LOCATION = handling(optional=True, purposes=["func"])
H_MEDIA = handling(optional=True, purposes=["func"])
H_MSG = handling(optional=True, purposes=["func"])
H_FITNESS = handling(optional=True, purposes=["func"])
H_UGC = handling(optional=True, purposes=["func"])
H_ACTIVITY = handling(optional=True, purposes=["func"])
H_FILES = handling(optional=True, purposes=["func"])
H_CRASH = handling(optional=False, purposes=["func", "fraud"])
H_DIAG = handling(optional=False, purposes=["func", "fraud"])
H_DEVICE = handling(optional=False, purposes=["func", "fraud"])


APPS: dict[str, dict] = {
    "curbcue": {
        "label": "Curbcue (FairShare)",
        "play_id": "4973784784637253598",
        "package": "com.chrissims.fairshare",
        "account_methods": ["PSL_ACM_OAUTH", "PSL_ACM_USER_ID_OTHER_AUTH"],
        "types": {
            "name": H_ACCOUNT,
            "email": H_ACCOUNT,
            "user_id": H_ACCOUNT,
            "approx_location": H_LOCATION,
            "interactions": H_ACTIVITY,
            "crash": H_CRASH,
            "diagnostics": H_DIAG,
            "device_id": H_DEVICE,
        },
        "notes": "Mobility compare; optional sign-in; approx location for ride/crowd context (foreground).",
    },
    "throttlelink": {
        "label": "ThrottleLink (MotoCrew)",
        "play_id": "4973807688393588463",
        "package": "com.chrissims.throttlelink",
        "account_methods": ["PSL_ACM_OAUTH", "PSL_ACM_USER_ID_OTHER_AUTH"],
        "types": {
            "name": H_ACCOUNT,
            "email": H_ACCOUNT,
            "user_id": H_ACCOUNT,
            "approx_location": H_LOCATION,
            "ugc": H_UGC,
            "other_messages": H_MSG,
            "interactions": H_ACTIVITY,
            "crash": H_CRASH,
            "diagnostics": H_DIAG,
            "device_id": H_DEVICE,
        },
        "notes": "Ride/crew coordination; optional accounts; approx location; routes/events as UGC; limited messaging.",
    },
    "coachcore": {
        "label": "CoachCore",
        "play_id": "4973388644367502581",
        "package": "com.macksims.coachcore",
        "account_methods": ["PSL_ACM_OAUTH", "PSL_ACM_USER_ID_OTHER_AUTH"],
        "types": {
            "name": H_ACCOUNT,
            "email": H_ACCOUNT,
            "user_id": H_ACCOUNT,
            "photos": H_MEDIA,
            "videos": H_MEDIA,
            "other_messages": H_MSG,
            "fitness": H_FITNESS,
            "ugc": H_UGC,
            "interactions": H_ACTIVITY,
            "crash": H_CRASH,
            "diagnostics": H_DIAG,
            "device_id": H_DEVICE,
        },
        "notes": "Coaching accountability. Fitness info YES (coaching). Health info NO (not medical).",
    },
    "sermonstudio": {
        "label": "Sermon Studio",
        "play_id": "4972609657779602718",
        "package": "com.chrissims.sermonstudio",
        "account_methods": ["PSL_ACM_OAUTH", "PSL_ACM_USER_ID_OTHER_AUTH"],
        "types": {
            "name": H_ACCOUNT,
            "email": H_ACCOUNT,
            "user_id": H_ACCOUNT,
            "files": H_FILES,
            "ugc": H_UGC,
            "interactions": H_ACTIVITY,
            "crash": H_CRASH,
            "diagnostics": H_DIAG,
            "device_id": H_DEVICE,
        },
        "notes": "Sermon drafts/files as docs/UGC. Do NOT mark Political or religious beliefs unless collecting belief demographics.",
    },
    "fishcrew": {
        "label": "FishCrew",
        "play_id": "EXISTING",
        "package": "com.chrissims.fishcrew",
        "account_methods": ["PSL_ACM_OAUTH", "PSL_ACM_USER_ID_OTHER_AUTH"],
        "types": {
            "name": H_ACCOUNT,
            "email": H_ACCOUNT,
            "user_id": H_ACCOUNT,
            "approx_location": H_LOCATION,
            "photos": H_MEDIA,
            "ugc": H_UGC,
            "other_messages": H_MSG,
            "interactions": H_ACTIVITY,
            "crash": H_CRASH,
            "diagnostics": H_DIAG,
            "device_id": H_DEVICE,
        },
        "notes": "Fishing community; profiles/photos/UGC; approx location for local water context.",
    },
    "shutterbid": {
        "label": "ShutterBid",
        "play_id": "EXISTING",
        "package": "com.chrissims.shutterbid",
        "account_methods": ["PSL_ACM_OAUTH", "PSL_ACM_USER_ID_OTHER_AUTH"],
        "types": {
            "name": H_ACCOUNT,
            "email": H_ACCOUNT,
            "user_id": H_ACCOUNT,
            "photos": H_MEDIA,
            "videos": H_MEDIA,
            "ugc": H_UGC,
            "other_messages": H_MSG,
            "interactions": H_ACTIVITY,
            "crash": H_CRASH,
            "diagnostics": H_DIAG,
            "device_id": H_DEVICE,
        },
        "notes": "Marketplace; portfolio photos/videos; job/bid UGC. No payments declared until live commerce.",
    },
    "aegis": {
        "label": "Aegis Intel",
        "play_id": "4974865040133809883",
        "package": "com.chrissims.aegisintel",
        "account_methods": ["PSL_ACM_OAUTH", "PSL_ACM_USER_ID_OTHER_AUTH"],
        "types": {
            "email": H_ACCOUNT,
            "user_id": H_ACCOUNT,
            "ugc": H_UGC,
            "interactions": H_ACTIVITY,
            "crash": H_CRASH,
            "diagnostics": H_DIAG,
            "device_id": H_DEVICE,
        },
        "notes": "Market research / watchlists. Optional Supabase sign-in. Guest data stays on-device. No location, media, fitness, payments, or ads.",
    },
}


def load_template() -> tuple[list[str], list[dict[str, str]]]:
    with TEMPLATE.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = [dict(r) for r in reader]
    return fieldnames, rows


def clear_values(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    out = deepcopy(rows)
    for r in out:
        r["Response value"] = ""
    return out


def set_value(rows: list[dict[str, str]], qid: str, rid: str, value: str) -> None:
    rid = rid or ""
    for r in rows:
        if r["Question ID (machine readable)"] == qid and (r["Response ID (machine readable)"] or "") == rid:
            r["Response value"] = value
            return
    raise KeyError(f"Missing row qid={qid!r} rid={rid!r}")


def set_type_handling(rows: list[dict[str, str]], type_key: str, h: dict) -> None:
    group, type_id = TYPES[type_key]
    set_value(rows, group, type_id, "true")

    base = f"PSL_DATA_USAGE_RESPONSES:{type_id}"
    # collected / shared
    if h["collected"]:
        set_value(rows, f"{base}:PSL_DATA_USAGE_COLLECTION_AND_SHARING", "PSL_DATA_USAGE_ONLY_COLLECTED", "true")
    if h["shared"]:
        set_value(rows, f"{base}:PSL_DATA_USAGE_COLLECTION_AND_SHARING", "PSL_DATA_USAGE_ONLY_SHARED", "true")

    if h["ephemeral"] is not None and h["collected"]:
        set_value(rows, f"{base}:PSL_DATA_USAGE_EPHEMERAL", "", "true" if h["ephemeral"] else "false")

    if h["collected"]:
        if h["optional"]:
            set_value(rows, f"{base}:DATA_USAGE_USER_CONTROL", "PSL_DATA_USAGE_USER_CONTROL_OPTIONAL", "true")
        else:
            set_value(rows, f"{base}:DATA_USAGE_USER_CONTROL", "PSL_DATA_USAGE_USER_CONTROL_REQUIRED", "true")
        for p in h["purposes"]:
            set_value(rows, f"{base}:DATA_USAGE_COLLECTION_PURPOSE", PURPOSE[p], "true")

    if h["shared"]:
        for p in h["share_purposes"] or h["purposes"]:
            set_value(rows, f"{base}:DATA_USAGE_SHARING_PURPOSE", PURPOSE[p], "true")


def build_app(app_key: str, fieldnames: list[str], template_rows: list[dict[str, str]]) -> Path:
    cfg = APPS[app_key]
    rows = clear_values(template_rows)

    # Overview
    set_value(rows, "PSL_DATA_COLLECTION_COLLECTS_PERSONAL_DATA", "", "true")
    set_value(rows, "PSL_DATA_COLLECTION_ENCRYPTED_IN_TRANSIT", "", "true")

    # Account creation
    for method in cfg["account_methods"]:
        set_value(rows, "PSL_SUPPORTED_ACCOUNT_CREATION_METHODS", method, "true")

    # Deletion (correct: Yes + URL — NOT auto-delete-only)
    set_value(rows, "PSL_SUPPORT_DATA_DELETION_BY_USER", "DATA_DELETION_YES", "true")
    set_value(rows, "PSL_ACCOUNT_DELETION_URL", "", DELETION_URL)
    set_value(rows, "PSL_DATA_DELETION_URL", "", DELETION_URL)

    # Families / MASA / UPI left blank (optional / N/A)
    # Outside-app accounts optional blank

    for type_key, h in cfg["types"].items():
        set_type_handling(rows, type_key, h)

    out = OUT_DIR / f"data_safety_{app_key}.csv"
    with out.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    return out


def write_readme() -> None:
    lines = [
        "# Google Play Data Safety CSVs (MackSims)",
        "",
        "**Template:** `d:\\Downloads\\RetroArch\\data_safety_export.csv` (Play export format).",
        "**Generated:** import-ready files in this folder.",
        "",
        "## Shared answers (all apps)",
        "",
        "| Field | Value |",
        "| --- | --- |",
        "| Collects personal data | Yes |",
        "| Encrypted in transit | Yes |",
        "| Account deletion / data deletion | **Yes** (user can request) |",
        "| Deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` |",
        "| Sharing posture | **Collected only** (service providers process on our behalf; not sold; no ads) |",
        "| Advertising purpose | Never |",
        "| SMS / MMS | Never |",
        "| Precise location | Never (approx only where listed) |",
        "| Health info | Never |",
        "| Payments | Never (until commerce is live) |",
        "",
        "## How to import in Play Console",
        "",
        "1. Open the app → **App content** → **Data safety**.",
        "2. Prefer completing the wizard using the matching CSV / matrix below (Play import UI varies; if no CSV import, answer the wizard from this file).",
        "3. Privacy policy URL (separate App content field): `https://macksims-public-site.netlify.app/privacy/`.",
        "",
        "## Per-app files",
        "",
        "| App | CSV | Declared types (high level) |",
        "| --- | --- | --- |",
    ]
    for key, cfg in APPS.items():
        types = ", ".join(cfg["types"].keys())
        lines.append(f"| {cfg['label']} | `data_safety_{key}.csv` | {types} |")
    lines += [
        "",
        "## Corrections vs RetroArch template",
        "",
        "- Switched deletion from **auto-delete within 90 days** → **Yes, user can request deletion** + Netlify URL.",
        "- Removed **SMS/MMS** (not collected by MackSims apps).",
        "- Stopped marking email/user IDs as **Shared** for analytics/ads — use **Collected** only.",
        "- Narrowed purposes (no Advertising / unnecessary Personalization on diagnostics).",
        "- CoachCore: **Fitness** yes, **Health** no.",
        "- Location apps: **Approximate** only, optional.",
        "",
        "## Notes",
        "",
    ]
    for key, cfg in APPS.items():
        lines.append(f"- **{cfg['label']}:** {cfg['notes']}")
    lines.append("")
    (OUT_DIR / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    fieldnames, template_rows = load_template()
    for key in APPS:
        path = build_app(key, fieldnames, template_rows)
        print("WROTE", path)
    write_readme()
    print("WROTE", OUT_DIR / "README.md")


if __name__ == "__main__":
    main()
