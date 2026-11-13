import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';

// Compose the existing brand artwork; no generated artwork or network requests.
// Run from any directory: node scripts/prepare-social-image.mjs
const root = new URL('../', import.meta.url);
const [background, logo] = await Promise.all([
  loadImage(fileURLToPath(new URL('src/assets/images/optimized/hero-bg.jpg', root))),
  loadImage(fileURLToPath(new URL('src/assets/images/optimized/brand-logo-strip.png', root))),
]);
const canvas = createCanvas(1200, 630);
const context = canvas.getContext('2d');
const scale = Math.max(canvas.width / background.width, canvas.height / background.height);
const width = background.width * scale;
const height = background.height * scale;
context.drawImage(background, (1200 - width) / 2, (630 - height) / 2, width, height);

// Darken the existing left-hand text area without obscuring the mascot.
const shade = context.createLinearGradient(0, 0, 650, 0);
shade.addColorStop(0, '#05080f99');
shade.addColorStop(1, '#05080f00');
context.fillStyle = shade;
context.fillRect(0, 0, 650, 630);
context.drawImage(logo, 58, 160, 510, 510 * logo.height / logo.width);

context.fillStyle = '#ffffff';
context.font = '600 42px sans-serif';
context.fillText('Yaman Balkesh', 85, 316);
context.fillStyle = '#b0bec5';
context.font = '24px sans-serif';
context.fillText('Brand identities. Packaging.', 85, 365);
context.fillText('Social media. Campaigns.', 85, 400);
context.fillStyle = '#00f5d4';
context.font = '22px sans-serif';
context.fillText('design-man.me', 85, 512);

const directory = new URL('public/social/', root);
await fs.mkdir(directory, { recursive: true });
const output = new URL('design-man-preview-v1.jpg', directory);
const bytes = await canvas.encode('jpeg', 90);
await fs.writeFile(output, bytes);
console.log(`Created ${fileURLToPath(output)} (1200×630, ${Math.round(bytes.length / 1024)} KB)`);
