// Generates local SVG placeholder art for Cakoo (hero poster, product photos,
// gallery, OG image) so the site has a cohesive premium look with zero
// external dependencies or network calls. Replace these with real bakery
// photography/video whenever the business has assets — see README.
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public", "images");

const PALETTES = [
  { bg: ["#3A2417", "#5A3825"], glow: "#C68B57", accent: "#E9D6BA" },
  { bg: ["#4A2A1A", "#6B4128"], glow: "#D2A679", accent: "#F5EAD8" },
  { bg: ["#2E1A10", "#4A2C1D"], glow: "#9C3B4A", accent: "#E9D6BA" },
  { bg: ["#5A3825", "#7A5230"], glow: "#C68B57", accent: "#FBF6EE" },
  { bg: ["#3A2417", "#5C3A21"], glow: "#B8860B", accent: "#F5EAD8" },
];

const ICONS = {
  cake: (c) => `
    <rect x="-38" y="-6" width="76" height="34" rx="6" fill="${c}" opacity="0.9"/>
    <rect x="-30" y="-26" width="60" height="26" rx="6" fill="${c}" opacity="0.75"/>
    <path d="M -30 -26 Q -20 -38 -10 -26 Q 0 -38 10 -26 Q 20 -38 30 -26" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="-3" y="-46" width="6" height="14" rx="2" fill="${c}"/>
    <ellipse cx="0" cy="-50" rx="4" ry="6" fill="${c}" opacity="0.8"/>
  `,
  cupcake: (c) => `
    <path d="M -26 6 L 26 6 L 18 40 Q 0 48 -18 40 Z" fill="${c}" opacity="0.9"/>
    <path d="M -30 6 Q 0 -10 30 6 Q 20 22 0 14 Q -20 22 -30 6 Z" fill="${c}"/>
    <path d="M 0 -14 Q -10 -22 -2 -30 Q 6 -22 -2 -14" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="-10" cy="20" r="2.5" fill="${c}" opacity="0.5"/>
    <circle cx="8" cy="26" r="2.5" fill="${c}" opacity="0.5"/>
    <circle cx="2" cy="14" r="2.5" fill="${c}" opacity="0.5"/>
  `,
  donut: (c) => `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 -34a34 34 0 100 68 34 34 0 000-68zm0 21a13 13 0 100 26 13 13 0 000-26z" fill="${c}" opacity="0.85"/>
    <circle cx="-14" cy="-10" r="2.4" fill="${c}" opacity="0.5"/>
    <circle cx="10" cy="-16" r="2.4" fill="${c}" opacity="0.5"/>
    <circle cx="16" cy="6" r="2.4" fill="${c}" opacity="0.5"/>
    <circle cx="-4" cy="18" r="2.4" fill="${c}" opacity="0.5"/>
  `,
  croissant: (c) => `
    <path d="M -34 10 Q -30 -30 4 -34 Q 38 -30 34 10 Q 18 -6 0 -4 Q -18 -6 -34 10 Z" fill="${c}" opacity="0.9"/>
    <path d="M -20 -6 Q -14 -16 -6 -18" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M 6 -18 Q 14 -16 20 -6" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
  `,
  cookie: (c) => `
    <circle cx="0" cy="0" r="32" fill="${c}" opacity="0.9"/>
    <circle cx="-10" cy="-8" r="3.2" fill="${c}" opacity="0.35"/>
    <circle cx="9" cy="-14" r="3.2" fill="${c}" opacity="0.35"/>
    <circle cx="14" cy="4" r="3.2" fill="${c}" opacity="0.35"/>
    <circle cx="-4" cy="14" r="3.2" fill="${c}" opacity="0.35"/>
    <circle cx="-16" cy="6" r="3.2" fill="${c}" opacity="0.35"/>
  `,
  bread: (c) => `
    <path d="M -34 10 Q -34 -18 0 -20 Q 34 -18 34 10 Q 0 22 -34 10 Z" fill="${c}" opacity="0.9"/>
    <path d="M -18 -8 L -10 6" stroke="${c}" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
    <path d="M -2 -10 L 6 6" stroke="${c}" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
    <path d="M 14 -8 L 22 6" stroke="${c}" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
  `,
  heart: (c) => `
    <path d="M0 26 C -26 6 -20 -20 -2 -18 C 6 -18 0 -8 0 -6 C 0 -8 -6 -18 2 -18 C 20 -20 26 6 0 26 Z" fill="${c}" opacity="0.9"/>
  `,
  sparkle: (c) => `
    <path d="M0 -34 L6 -6 L34 0 L6 6 L0 34 L-6 6 L-34 0 L-6 -6 Z" fill="${c}" opacity="0.85"/>
  `,
  gift: (c) => `
    <rect x="-28" y="-4" width="56" height="38" rx="4" fill="${c}" opacity="0.9"/>
    <rect x="-28" y="-18" width="56" height="16" rx="4" fill="${c}"/>
    <rect x="-5" y="-18" width="10" height="56" fill="${c}" opacity="0.55"/>
    <path d="M -5 -18 Q -20 -34 -5 -30 Q -5 -24 -5 -18" fill="${c}" opacity="0.6"/>
    <path d="M 5 -18 Q 20 -34 5 -30 Q 5 -24 5 -18" fill="${c}" opacity="0.6"/>
  `,
  whisk: (c) => `
    <line x1="0" y1="-36" x2="0" y2="-8" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
    <path d="M0 -8 C -20 -4 -20 24 0 30 C 20 24 20 -4 0 -8 Z" fill="none" stroke="${c}" stroke-width="3.5" opacity="0.85"/>
    <path d="M0 -8 C -12 0 -12 20 0 26" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.55"/>
    <path d="M0 -8 C 12 0 12 20 0 26" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.55"/>
  `,
  camera: (c) => `
    <rect x="-32" y="-14" width="64" height="42" rx="6" fill="${c}" opacity="0.9"/>
    <rect x="-10" y="-26" width="20" height="14" rx="3" fill="${c}" opacity="0.9"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 -8a14 14 0 100 28 14 14 0 000-28z" fill="${c}" opacity="0.5"/>
  `,
  oven: (c) => `
    <rect x="-32" y="-30" width="64" height="60" rx="6" fill="${c}" opacity="0.9"/>
    <circle cx="0" cy="0" r="18" fill="none" stroke="${c}" stroke-width="4" opacity="0.6"/>
    <circle cx="-22" cy="-22" r="3" fill="${c}" opacity="0.6"/>
    <circle cx="-12" cy="-22" r="3" fill="${c}" opacity="0.6"/>
  `,
  flour: (c) => `
    <circle cx="-18" cy="-24" r="2.4" fill="${c}" opacity="0.7"/>
    <circle cx="4" cy="-32" r="2" fill="${c}" opacity="0.6"/>
    <circle cx="20" cy="-18" r="2.6" fill="${c}" opacity="0.7"/>
    <circle cx="-6" cy="-10" r="2.2" fill="${c}" opacity="0.6"/>
    <path d="M -30 10 Q 0 24 30 10 Q 0 34 -30 10 Z" fill="${c}" opacity="0.85"/>
  `,
};

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function svgScene({ width, height, palette, icon, seed = 1, label }) {
  const rand = seededRandom(seed);
  const [c1, c2] = palette.bg;
  const gradId = `g${seed}`;
  const glowId = `glow${seed}`;

  let blobs = "";
  for (let i = 0; i < 4; i++) {
    const cx = rand() * width;
    const cy = rand() * height;
    const r = 60 + rand() * Math.min(width, height) * 0.28;
    blobs += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(
      0
    )}" fill="url(#${glowId})" opacity="${(0.12 + rand() * 0.14).toFixed(2)}"/>`;
  }

  const iconMarkup = icon
    ? `<g transform="translate(${width / 2}, ${height / 2}) scale(${(
        Math.min(width, height) / 170
      ).toFixed(2)})">${ICONS[icon](palette.accent)}</g>`
    : "";

  const labelMarkup = label
    ? `<text x="${width / 2}" y="${height - 28}" text-anchor="middle" font-family="Georgia, 'Playfair Display', serif" font-size="${Math.max(
        14,
        width * 0.026
      )}" fill="${palette.accent}" opacity="0.55" letter-spacing="6">${label}</text>`
    : "";

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="${glowId}">
      <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${gradId})"/>
  ${blobs}
  ${iconMarkup}
  ${labelMarkup}
</svg>`;
}

function write(file, content) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content, "utf8");
  console.log("wrote", path.relative(process.cwd(), file));
}

// Hero poster (fallback for the cinematic video)
write(
  path.join(ROOT, "cakoo-hero-poster.svg"),
  svgScene({
    width: 1920,
    height: 1080,
    palette: PALETTES[0],
    icon: "cake",
    seed: 7,
    label: "C A K O O",
  })
);

// About section image
write(
  path.join(ROOT, "about-cakoo.svg"),
  svgScene({ width: 1000, height: 1200, palette: PALETTES[1], icon: "whisk", seed: 11 })
);

// Custom cakes section image
write(
  path.join(ROOT, "custom-cake.svg"),
  svgScene({ width: 1000, height: 1200, palette: PALETTES[2], icon: "gift", seed: 13 })
);

// Social/OG image
write(
  path.join(ROOT, "og-image.svg"),
  svgScene({
    width: 1200,
    height: 630,
    palette: PALETTES[3],
    icon: "sparkle",
    seed: 17,
    label: "C A K O O   B A K E R Y",
  })
);

// Offers banner
write(
  path.join(ROOT, "offer-banner.svg"),
  svgScene({ width: 1400, height: 700, palette: PALETTES[4], icon: "sparkle", seed: 19 })
);

// Products
const products = [
  { slug: "chocolate-fudge-cake", icon: "cake", palette: 0 },
  { slug: "red-velvet-cake", icon: "cake", palette: 2 },
  { slug: "strawberry-cream-cake", icon: "cake", palette: 1 },
  { slug: "chocolate-croissant", icon: "croissant", palette: 0 },
  { slug: "cinnamon-roll", icon: "croissant", palette: 3 },
  { slug: "fresh-donuts", icon: "donut", palette: 4 },
  { slug: "brownies", icon: "cookie", palette: 2 },
  { slug: "vanilla-cupcakes", icon: "cupcake", palette: 1 },
  { slug: "new-york-cheesecake", icon: "cake", palette: 3 },
  { slug: "custom-celebration-cake", icon: "gift", palette: 4 },
  { slug: "butter-cookies", icon: "cookie", palette: 0 },
  { slug: "sourdough-bread", icon: "bread", palette: 1 },
  { slug: "placeholder", icon: "sparkle", palette: 2 },
];

products.forEach((p, i) => {
  write(
    path.join(ROOT, "products", `${p.slug}.svg`),
    svgScene({
      width: 900,
      height: 900,
      palette: PALETTES[p.palette],
      icon: p.icon,
      seed: 100 + i,
    })
  );
});

// Gallery
const galleryIcons = [
  "cake",
  "croissant",
  "cupcake",
  "donut",
  "whisk",
  "oven",
  "camera",
  "heart",
  "gift",
  "flour",
  "bread",
  "sparkle",
];
galleryIcons.forEach((icon, i) => {
  const tall = i % 3 === 0;
  write(
    path.join(ROOT, "gallery", `gallery-${i + 1}.svg`),
    svgScene({
      width: 800,
      height: tall ? 1000 : 800,
      palette: PALETTES[i % PALETTES.length],
      icon,
      seed: 200 + i,
    })
  );
});

console.log("Placeholder art generated.");
