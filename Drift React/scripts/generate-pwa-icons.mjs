import sharp from "sharp";
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");

const androidAny = readFileSync(join(iconsDir, "android-any.svg"));
const androidMaskable = readFileSync(join(iconsDir, "android-maskable.svg"));
const appleTouch = readFileSync(join(iconsDir, "apple-touch.svg"));

async function writePng(svg, size, filename) {
  await sharp(svg).resize(size, size).png().toFile(join(publicDir, filename));
  console.log(`Wrote ${filename}`);
}

// Android / Chromium manifest icons
for (const size of [192, 512]) {
  await writePng(androidAny, size, `icon-${size}.png`);
  await writePng(androidMaskable, size, `icon-maskable-${size}.png`);
}

// Browser favicon source
copyFileSync(join(iconsDir, "android-any.svg"), join(publicDir, "icon.svg"));

// Apple touch icons (iOS + macOS Safari)
const appleSizes = [
  { size: 120, name: "apple-touch-icon-120.png" },
  { size: 152, name: "apple-touch-icon-152.png" },
  { size: 167, name: "apple-touch-icon-167.png" },
  { size: 180, name: "apple-touch-icon-180.png" },
  { size: 512, name: "apple-touch-icon-512.png" },
];

for (const { size, name } of appleSizes) {
  await writePng(appleTouch, size, name);
}
