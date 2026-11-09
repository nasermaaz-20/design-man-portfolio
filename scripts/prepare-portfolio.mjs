import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { PDFDocument, PDFName, PDFNumber, PDFRawStream } from 'pdf-lib';
import { createCanvas, loadImage, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('Usage: node scripts/prepare-portfolio.mjs <original.pdf>');
const source = await fs.readFile(sourcePath);
const pdf = await PDFDocument.load(source, { updateMetadata: false });
const outputDirectory = path.resolve('output/pdf');
const outputPath = path.join(outputDirectory, 'yaman-balkesh-portfolio-2026.pdf');
if (path.resolve(sourcePath) === outputPath) throw new Error('The original must be a separate file.');
const changes = [];

for (const [ref, object] of pdf.context.enumerateIndirectObjects()) {
  if (!(object instanceof PDFRawStream)) continue;
  const dict = object.dict;
  if (dict.get(PDFName.of('Subtype'))?.toString() !== '/Image') continue;
  if (dict.get(PDFName.of('Filter'))?.toString() !== '/DCTDecode') continue;
  // Preserve small graphics and masked images exactly.
  if (object.contents.length < 100000 || dict.has(PDFName.of('SMask')) || dict.has(PDFName.of('Mask'))) continue;
  const image = await loadImage(Buffer.from(object.contents));
  const scale = Math.min(1, 1920 / Math.max(image.width, image.height));
  const canvas = createCanvas(Math.round(image.width * scale), Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const bytes = await canvas.encode('jpeg', 86);
  if (bytes.length >= object.contents.length * 0.9) continue;
  const replacement = dict.clone(pdf.context);
  replacement.set(PDFName.of('Width'), PDFNumber.of(canvas.width));
  replacement.set(PDFName.of('Height'), PDFNumber.of(canvas.height));
  replacement.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
  replacement.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
  replacement.delete(PDFName.of('Decode'));
  replacement.delete(PDFName.of('DecodeParms'));
  replacement.delete(PDFName.of('Length'));
  pdf.context.assign(ref, PDFRawStream.of(replacement, new Uint8Array(bytes)));
  changes.push({ object: ref.objectNumber, before: object.contents.length, after: bytes.length, width: canvas.width, height: canvas.height });
}

await fs.mkdir(outputDirectory, { recursive: true });
const optimized = await pdf.save({ useObjectStreams: true, objectsPerTick: 30 });
if (optimized.length >= source.length) throw new Error('Optimization did not reduce the PDF.');
await fs.writeFile(outputPath, optimized);

// Reopen with an independent engine, validate every page, and render for QA.
Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
const originalTask = getDocument({ data: new Uint8Array(source), useSystemFonts: true });
const optimizedTask = getDocument({ data: new Uint8Array(optimized), useSystemFonts: true });
const [originalDoc, optimizedDoc] = await Promise.all([originalTask.promise, optimizedTask.promise]);
if (originalDoc.numPages !== optimizedDoc.numPages) throw new Error('Page count changed.');
const reviewDirectory = path.resolve('tmp/pdfs');
await fs.mkdir(reviewDirectory, { recursive: true });
const sheet = createCanvas(1440, Math.ceil(optimizedDoc.numPages / 4) * 227);
const sheetContext = sheet.getContext('2d');
sheetContext.fillStyle = '#25282c';
sheetContext.fillRect(0, 0, sheet.width, sheet.height);
let annotationCount = 0;
for (let number = 1; number <= optimizedDoc.numPages; number++) {
  const [before, after] = await Promise.all([originalDoc.getPage(number), optimizedDoc.getPage(number)]);
  if (JSON.stringify(before.view) !== JSON.stringify(after.view)) throw new Error(`Page ${number} dimensions changed.`);
  const [beforeText, afterText, beforeLinks, afterLinks] = await Promise.all([
    before.getTextContent(), after.getTextContent(), before.getAnnotations(), after.getAnnotations(),
  ]);
  const strings = (text) => text.items.map((item) => item.str).join('\n');
  if (strings(beforeText) !== strings(afterText)) throw new Error(`Page ${number} text changed.`);
  const links = (items) => JSON.stringify(items.map(({ subtype, url, dest }) => ({ subtype, url, dest })));
  if (links(beforeLinks) !== links(afterLinks)) throw new Error(`Page ${number} links changed.`);
  annotationCount += afterLinks.length;
  const viewport = after.getViewport({ scale: 0.25 });
  const thumbnail = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  await after.render({ canvasContext: thumbnail.getContext('2d'), viewport }).promise;
  const x = ((number - 1) % 4) * 360;
  const y = Math.floor((number - 1) / 4) * 227;
  sheetContext.drawImage(thumbnail, x, y);
  sheetContext.fillStyle = '#fff';
  sheetContext.font = '13px sans-serif';
  sheetContext.fillText(String(number), x + 8, y + 219);
  if ([1, 5, 12, 19, 24, 27, 31].includes(number)) {
    for (const [label, page] of [['original', before], ['web', after]]) {
      const fullViewport = page.getViewport({ scale: 1 });
      const full = createCanvas(fullViewport.width, fullViewport.height);
      await page.render({ canvasContext: full.getContext('2d'), viewport: fullViewport }).promise;
      await fs.writeFile(path.join(reviewDirectory, `${label}-${number}.png`), full.toBuffer('image/png'));
      if (number === 1 && label === 'web') {
        await fs.writeFile('src/assets/images/optimized/portfolio-cover.webp', await full.encode('webp', 90));
      }
    }
  }
}
await fs.writeFile(path.join(reviewDirectory, 'portfolio-contact-sheet.png'), sheet.toBuffer('image/png'));
const report = {
  sourceBytes: source.length, outputBytes: optimized.length,
  reductionPercent: Number(((1 - optimized.length / source.length) * 100).toFixed(1)),
  pages: optimizedDoc.numPages, pageWidth: 1440, pageHeight: 810,
  optimizedImages: changes.length, preservedAnnotations: annotationCount,
  jpegQuality: 86, maximumImageDimension: 1920,
  textAndPageDimensionsVerified: true,
  originalSha256: createHash('sha256').update(source).digest('hex'),
  optimizedSha256: createHash('sha256').update(optimized).digest('hex'),
  images: changes,
};
await fs.writeFile(path.join(outputDirectory, 'optimization-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, images: undefined }, null, 2));
await Promise.all([originalTask.destroy(), optimizedTask.destroy()]);
