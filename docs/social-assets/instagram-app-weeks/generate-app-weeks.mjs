import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.resolve(here, "../../../public-site/public/social/instagram/app-weeks");
const W = 1080;
const H = 1350;

const APP = {
  FishCrew: {
    slug: "fishcrew",
    accent: "#38bdf8",
    accentSoft: "rgba(56,189,248,.14)",
    accentStroke: "rgba(56,189,248,.42)",
    badge: "External beta",
  },
  ShutterBid: {
    slug: "shutterbid",
    accent: "#f0abfc",
    accentSoft: "rgba(240,171,252,.14)",
    accentStroke: "rgba(240,171,252,.42)",
    badge: "External beta",
  },
  CurbCue: {
    slug: "curbcue",
    accent: "#86efac",
    accentSoft: "rgba(134,239,172,.14)",
    accentStroke: "rgba(134,239,172,.42)",
    badge: "Simulated demo",
  },
  MotoCrew: {
    slug: "motocrew",
    accent: "#fbbf24",
    accentSoft: "rgba(251,191,36,.14)",
    accentStroke: "rgba(251,191,36,.42)",
    badge: "Sample ride data",
  },
};

const C = {
  bg: "#0b0a10",
  panel: "#15121d",
  text: "#f6f1fb",
  muted: "#b7adc7",
  soft: "#8f859e",
  line: "rgba(255,255,255,.10)",
  gold: "#d4a24c",
  goldBright: "#f0cb7d",
  purple: "#7c3aed",
  purpleDark: "#3b1578",
};

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function wrap(text, max = 28) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  return lines;
}

function defs(accent) {
  return `<defs>
    <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(120 80) rotate(40) scale(720 620)">
      <stop stop-color="${accent}" stop-opacity=".22"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 1240) rotate(-140) scale(680 560)">
      <stop stop-color="${C.gold}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${C.gold}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="msFill" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${C.purple}"/>
      <stop offset="1" stop-color="${C.purpleDark}"/>
    </linearGradient>
  </defs>`;
}

function msMark() {
  return `<g transform="translate(72 58)">
    <rect width="52" height="52" rx="14" fill="url(#msFill)" stroke="rgba(212,162,76,.5)"/>
    <text x="26" y="34" fill="${C.goldBright}" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="900" text-anchor="middle">MS</text>
    <text x="68" y="34" fill="${C.soft}" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700">MackSims</text>
  </g>`;
}

function footer(app, index, total) {
  return `<g>
    <line x1="72" y1="1248" x2="1008" y2="1248" stroke="${C.line}"/>
    <text x="72" y="1294" fill="${C.soft}" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="650">${esc(app)}</text>
    <text x="1008" y="1294" fill="${C.soft}" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" text-anchor="end">${index} / ${total}</text>
  </g>`;
}

function badge(label, accent, soft, stroke, x = 72, y = 140) {
  const width = Math.max(170, label.length * 15 + 48);
  return `<g transform="translate(${x} ${y})">
    <rect width="${width}" height="48" rx="24" fill="${soft}" stroke="${stroke}"/>
    <text x="${width / 2}" y="31" fill="${accent}" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" text-anchor="middle" letter-spacing="1.4">${esc(label.toUpperCase())}</text>
  </g>`;
}

function titleBlock(lines, y = 230, size = 64) {
  return lines
    .map((line, i) => {
      const dy = i === 0 ? y : y + i * Math.round(size * 1.12);
      return `<text x="72" y="${dy}" fill="${C.text}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="800">${esc(line)}</text>`;
    })
    .join("");
}

function bodyBlock(lines, y, size = 30) {
  return lines
    .map((line, i) => `<text x="72" y="${y + i * Math.round(size * 1.35)}" fill="${C.muted}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="550">${esc(line)}</text>`)
    .join("");
}

function cardList(items, startY, accent, soft, stroke) {
  return items
    .map((item, i) => {
      const y = startY + i * 118;
      return `<g transform="translate(72 ${y})">
        <rect width="936" height="100" rx="24" fill="${C.panel}" stroke="${C.line}"/>
        <circle cx="48" cy="50" r="22" fill="${soft}" stroke="${stroke}"/>
        <text x="48" y="57" fill="${accent}" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="800" text-anchor="middle">${i + 1}</text>
        <text x="96" y="58" fill="${C.text}" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700">${esc(item)}</text>
      </g>`;
    })
    .join("");
}

function slideShell(appName, accent, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(accent)}
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  ${msMark()}
  ${content}
</svg>`;
}

function communitySlides(appName, theme, slides) {
  return slides.map((slide, index) => ({
    file: `${String(index + 1).padStart(2, "0")}-${slide.slug}.svg`,
    alt: slide.alt,
    svg: slideShell(
      appName,
      theme.accent,
      `${badge(theme.badge, theme.accent, theme.accentSoft, theme.accentStroke)}
       ${titleBlock(wrap(slide.title, 18), 230, 58)}
       ${bodyBlock(wrap(slide.body, 36), 470, 30)}
       ${footer(appName, index + 1, slides.length)}`,
    ),
  }));
}

function walkthroughSlides(appName, theme, title, steps, note) {
  const cover = {
    file: "01-cover.svg",
    alt: `${appName} walkthrough cover: ${title}`,
    svg: slideShell(
      appName,
      theme.accent,
      `${badge(theme.badge, theme.accent, theme.accentSoft, theme.accentStroke)}
       ${titleBlock(wrap(title, 18), 230, 58)}
       ${bodyBlock(wrap("A calm look at the current public beta — no launch theater.", 34), 470, 30)}
       ${footer(appName, 1, steps.length + 2)}`,
    ),
  };
  const stepSlides = steps.map((step, i) => ({
    file: `${String(i + 2).padStart(2, "0")}-step.svg`,
    alt: `${appName} walkthrough step ${i + 1}: ${step}`,
    svg: slideShell(
      appName,
      theme.accent,
      `${badge(`Step ${i + 1}`, theme.accent, theme.accentSoft, theme.accentStroke)}
       ${titleBlock(wrap(step, 20), 250, 54)}
       ${bodyBlock(wrap(note, 34), 520, 28)}
       ${footer(appName, i + 2, steps.length + 2)}`,
    ),
  }));
  const close = {
    file: `${String(steps.length + 2).padStart(2, "0")}-close.svg`,
    alt: `${appName} walkthrough closing slide inviting feedback.`,
    svg: slideShell(
      appName,
      theme.accent,
      `${badge("Your turn", theme.accent, theme.accentSoft, theme.accentStroke)}
       ${titleBlock(wrap("What would make this more useful for you?", 18), 250, 52)}
       ${bodyBlock(wrap("Reply with the step that still feels messy.", 34), 520, 30)}
       ${footer(appName, steps.length + 2, steps.length + 2)}`,
    ),
  };
  return [cover, ...stepSlides, close];
}

function conversationSlides(appName, theme, question, detail) {
  return [
    {
      file: "01-cover.svg",
      alt: `${appName} conversation cover inviting feedback.`,
      svg: slideShell(
        appName,
        theme.accent,
        `${badge("Soft ask", theme.accent, theme.accentSoft, theme.accentStroke)}
         ${titleBlock(wrap("We’d love your honest notes.", 18), 250, 56)}
         ${bodyBlock(wrap(detail, 34), 500, 30)}
         ${footer(appName, 1, 3)}`,
      ),
    },
    {
      file: "02-question.svg",
      alt: `${appName} question slide: ${question}`,
      svg: slideShell(
        appName,
        theme.accent,
        `${badge(theme.badge, theme.accent, theme.accentSoft, theme.accentStroke)}
         ${titleBlock(wrap(question, 18), 250, 54)}
         ${bodyBlock(wrap("One specific answer helps more than a generic review.", 34), 540, 30)}
         ${footer(appName, 2, 3)}`,
      ),
    },
    {
      file: "03-cta.svg",
      alt: `${appName} closing slide pointing to the link in bio.`,
      svg: slideShell(
        appName,
        theme.accent,
        `${badge("Link in bio", theme.accent, theme.accentSoft, theme.accentStroke)}
         ${titleBlock(wrap("Try the demo when you’re ready.", 18), 250, 56)}
         ${bodyBlock(wrap("Native invites depend on the app and availability. Joining a list doesn’t guarantee one.", 34), 520, 28)}
         ${footer(appName, 3, 3)}`,
      ),
    },
  ];
}

const packs = [
  {
    app: "FishCrew",
    folder: "fishcrew/01-community",
    slides: communitySlides("FishCrew", APP.FishCrew, [
      {
        slug: "cover",
        title: "The plan lives in five places.",
        body: "Weather. Tide. A group chat. A pin. A cooler somebody forgot.",
        alt: "FishCrew community cover about fishing plans scattered across apps and chats.",
      },
      {
        slug: "moment",
        title: "Launch time keeps moving.",
        body: "One person checks conditions. Another changes the meetup. The thread never settles.",
        alt: "FishCrew slide about changing launch times in group chat.",
      },
      {
        slug: "calm",
        title: "A calmer place for the planning mess.",
        body: "FishCrew is an external beta for water window, crew notes, and local tools.",
        alt: "FishCrew slide introducing a calmer planning place.",
      },
      {
        slug: "ask",
        title: "What does your crew forget first?",
        body: "Tide, weather, bait, launch time, or the cooler?",
        alt: "FishCrew question slide asking what crews forget before launch.",
      },
    ]),
  },
  {
    app: "FishCrew",
    folder: "fishcrew/02-walkthrough",
    slides: walkthroughSlides(
      "FishCrew",
      APP.FishCrew,
      "A simple trip-planning loop",
      [
        "Check the local water window",
        "Glance at tools and guides",
        "Browse open trips and partners",
      ],
      "Planning aid only — verify official forecasts and local regulations.",
    ),
  },
  {
    app: "FishCrew",
    folder: "fishcrew/03-conversation",
    slides: conversationSlides(
      "FishCrew",
      APP.FishCrew,
      "Where does the planning still feel messy?",
      "Gentle feedback from anglers and crews who actually plan trips.",
    ),
  },
  {
    app: "ShutterBid",
    folder: "shutterbid/01-community",
    slides: communitySlides("ShutterBid", APP.ShutterBid, [
      {
        slug: "cover",
        title: "The job starts in a vague DM.",
        body: "Then an email. Then three follow-ups nobody wants to send.",
        alt: "ShutterBid community cover about vague photography job requests.",
      },
      {
        slug: "moment",
        title: "Quotes get heavier than the shoot.",
        body: "Clients can’t compare cleanly. Photographers lose context between chats.",
        alt: "ShutterBid slide about messy quoting between clients and photographers.",
      },
      {
        slug: "calm",
        title: "Post. Compare. Book.",
        body: "ShutterBid is testing a clearer path. Sample listings are labeled while the marketplace fills.",
        alt: "ShutterBid slide introducing post, compare, book.",
      },
      {
        slug: "ask",
        title: "Where does quoting break down?",
        body: "Briefs, rates, revisions, or the silence after a quote?",
        alt: "ShutterBid question slide about quoting friction.",
      },
    ]),
  },
  {
    app: "ShutterBid",
    folder: "shutterbid/02-walkthrough",
    slides: walkthroughSlides(
      "ShutterBid",
      APP.ShutterBid,
      "Inside the public beta",
      [
        "Post a job with the details that matter",
        "Compare bids side by side",
        "Move toward booking without losing the thread",
      ],
      "Sample listings are labeled sample. Payments are not live.",
    ),
  },
  {
    app: "ShutterBid",
    folder: "shutterbid/03-conversation",
    slides: conversationSlides(
      "ShutterBid",
      APP.ShutterBid,
      "What would you never want to type twice?",
      "Notes from photographers and clients both help.",
    ),
  },
  {
    app: "CurbCue",
    folder: "curbcue/01-community",
    slides: communitySlides("CurbCue", APP.CurbCue, [
      {
        slug: "cover",
        title: "The fare jumps. The curb looks worse.",
        body: "Sometimes deciding is harder than getting the ride.",
        alt: "CurbCue community cover about fare jumps and curb chaos.",
      },
      {
        slug: "moment",
        title: "One number isn’t the whole story.",
        body: "Price, wait, and pickup pressure all change the decision.",
        alt: "CurbCue slide about ride context beyond a single fare.",
      },
      {
        slug: "calm",
        title: "Compare the context first.",
        body: "CurbCue’s current preview uses simulated demo data — no live fares or bookings.",
        alt: "CurbCue slide clarifying simulated demo data.",
      },
      {
        slug: "ask",
        title: "Price or pickup pressure?",
        body: "Before you book, which one usually wins?",
        alt: "CurbCue question slide about price versus pickup pressure.",
      },
    ]),
  },
  {
    app: "CurbCue",
    folder: "curbcue/02-walkthrough",
    slides: walkthroughSlides(
      "CurbCue",
      APP.CurbCue,
      "A calm simulated walkthrough",
      [
        "Enter a simple trip",
        "Compare fare, wait, and pickup cards",
        "Check CrowdMeter-style pressure",
      ],
      "Every number in this preview is simulated. No booking happens here.",
    ),
  },
  {
    app: "CurbCue",
    folder: "curbcue/03-conversation",
    slides: conversationSlides(
      "CurbCue",
      APP.CurbCue,
      "What still feels unclear before you book?",
      "Useful feedback is about clarity and decision-making, not exact fares.",
    ),
  },
  {
    app: "MotoCrew",
    folder: "motocrew/01-community",
    slides: communitySlides("MotoCrew", APP.MotoCrew, [
      {
        slug: "cover",
        title: "The pin changed. The chat moved on.",
        body: "Meetup details disappear between memes and reactions.",
        alt: "MotoCrew community cover about ride details lost in group chat.",
      },
      {
        slug: "moment",
        title: "Kickstands up, still asking where.",
        body: "Pace, stops, and last-minute changes never had one home.",
        alt: "MotoCrew slide about confused meetup moments before rides.",
      },
      {
        slug: "calm",
        title: "One place for the ride details.",
        body: "MotoCrew’s demo uses sample ride info and is for planning only — never while riding.",
        alt: "MotoCrew slide clarifying sample data and planning-only use.",
      },
      {
        slug: "ask",
        title: "Where do changes get lost?",
        body: "Group chat, multiple apps, or nowhere at all?",
        alt: "MotoCrew question slide about lost ride changes.",
      },
    ]),
  },
  {
    app: "MotoCrew",
    folder: "motocrew/02-walkthrough",
    slides: (() => {
      const theme = APP.MotoCrew;
      const items = [
        "One source for meetup time and place",
        "Route and stops everyone can see",
        "Pace expectations before helmets go on",
        "A clear place for last-minute changes",
        "A safety reminder before departure",
      ];
      return [
        {
          file: "01-cover.svg",
          alt: "MotoCrew checklist cover for calmer group-ride planning.",
          svg: slideShell(
            "MotoCrew",
            theme.accent,
            `${badge(theme.badge, theme.accent, theme.accentSoft, theme.accentStroke)}
             ${titleBlock(wrap("A calmer pre-ride checklist", 18), 230, 56)}
             ${bodyBlock(wrap("Sample ride details. Plan before you roll.", 34), 470, 30)}
             ${footer("MotoCrew", 1, 3)}`,
          ),
        },
        {
          file: "02-checklist.svg",
          alt: "MotoCrew checklist of meetup, route, pace, changes, and safety.",
          svg: slideShell(
            "MotoCrew",
            theme.accent,
            `${badge("Checklist", theme.accent, theme.accentSoft, theme.accentStroke)}
             ${cardList(items, 220, theme.accent, theme.accentSoft, theme.accentStroke)}
             ${footer("MotoCrew", 2, 3)}`,
          ),
        },
        {
          file: "03-safety.svg",
          alt: "MotoCrew safety reminder never to use the app while riding.",
          svg: slideShell(
            "MotoCrew",
            theme.accent,
            `${badge("Safety", theme.accent, theme.accentSoft, theme.accentStroke)}
             ${titleBlock(wrap("Never use the app while riding.", 16), 250, 54)}
             ${bodyBlock(wrap("Configure everything before departure. Demo rides are sample data.", 34), 520, 30)}
             ${footer("MotoCrew", 3, 3)}`,
          ),
        },
      ];
    })(),
  },
  {
    app: "MotoCrew",
    folder: "motocrew/03-conversation",
    slides: conversationSlides(
      "MotoCrew",
      APP.MotoCrew,
      "Which detail disappears first?",
      "Meetup, route, pace, stops, or safety notes?",
    ),
  },
];

async function rasterize(svgPath, jpgPath, sharp) {
  await sharp(fs.readFileSync(svgPath), { density: 180 })
    .resize(W, H)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(jpgPath);
}

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("Install sharp first: npm install sharp --no-save");
    process.exit(1);
  }

  const manifest = [];
  for (const pack of packs) {
    const sourceDir = path.join(here, pack.folder);
    const publicDir = path.join(publicRoot, pack.folder);
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(publicDir, { recursive: true });
    for (const slide of pack.slides) {
      const svgPath = path.join(sourceDir, slide.file);
      const jpgName = slide.file.replace(/\.svg$/i, ".jpg");
      const jpgPath = path.join(publicDir, jpgName);
      fs.writeFileSync(svgPath, slide.svg, "utf8");
      await rasterize(svgPath, jpgPath, sharp);
      manifest.push({
        app: pack.app,
        folder: pack.folder,
        svg: path.relative(here, svgPath).replaceAll("\\", "/"),
        jpg: path.relative(publicRoot, jpgPath).replaceAll("\\", "/"),
        alt: slide.alt,
      });
    }
    console.log(`Generated ${pack.folder} (${pack.slides.length} slides)`);
  }
  fs.writeFileSync(path.join(here, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${manifest.length} slides.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
