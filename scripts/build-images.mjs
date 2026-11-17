// Makes every size next/image can ask for, ahead of time, as WebP.
//
// Runs before `next dev` and `next build` (predev / prebuild). Every PNG and
// JPEG in public/ gets one file per width in src/lib/image-sizes.json, in
// public/_img/ at the same path. A width wider than the picture is written
// at the picture's own size, never enlarged. Files already newer than their
// source are skipped, so a rerun is quick. See src/lib/imageLoader.ts.
import { readFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import sharp from "sharp";

const PUBLIC = "public";
const OUT = join(PUBLIC, "_img");
// The depth map is read as data by the 3D portrait, not shown as a picture.
const SKIP = new Set(["Profpic-depth.png"]);

const { deviceSizes, imageSizes } = JSON.parse(readFileSync("src/lib/image-sizes.json", "utf8"));
const widths = [...new Set([...imageSizes, ...deviceSizes])].sort((a, b) => a - b);

function* pictures(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (path === OUT) continue;
    if (statSync(path).isDirectory()) yield* pictures(path);
    else if (/\.(png|jpe?g)$/i.test(name) && !SKIP.has(name)) yield path;
  }
}

let made = 0;
for (const src of pictures(PUBLIC)) {
  const base = join(OUT, relative(PUBLIC, src)).replace(/\.(png|jpe?g)$/i, "");
  mkdirSync(dirname(base), { recursive: true });
  const changed = statSync(src).mtimeMs;
  for (const width of widths) {
    const out = `${base}-${width}.webp`;
    if (existsSync(out) && statSync(out).mtimeMs >= changed) continue;
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
    made++;
  }
}
console.log(`build-images: ${made} made, ${widths.length} sizes per picture`);
