import sharp from "sharp";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const svg = readFileSync(join(publicDir, "icon.svg"));

for (const size of [192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(join(publicDir, `icon-${size}.png`));
  console.log(`Wrote icon-${size}.png`);
}
