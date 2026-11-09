# Portfolio PDF — implementation and verification

Updated: 2026-11-09.

## Visitor experience

Mode: Experience. The supplied portfolio is the main content; controls stay quiet and readable.

- The home-page feature sits immediately after Selected Work and before About. Its cover comes from the actual first PDF page. It shows the year, page count and file size, and links to `/portfolio/`.
- The footer supplies a second entry point. The main contact action remains unchanged.
- All screen sizes: one complete page at a time, fitted to both the available width and height below the controls. Previous/next buttons, a page-number field, keyboard arrows/Home/End, zoom, “Fit page” and browser fullscreen where supported remain available.
- The default 100% is relative to the fitted page. Scrollbars appear only when enlarged content exceeds the reading area. “Fit page” restores the whole page and resets its scroll position. Resizing or rotating the screen recalculates the fit.
- `#page=24` opens page 24 and survives refresh. The active page updates the URL without adding browser-history entries.
- Text remains selectable, and the four external PDF links remain clickable. Links open independently. PDF JavaScript is not executed by this viewer.
- Loading progress, document/page retry states, a direct “Open PDF” link, and a return-to-work link provide recovery paths.
- No home intro, custom cursor or smooth-scroll controller is mounted in the viewer.

## Compression

The original in Downloads is untouched. The web copy is at `output/pdf/yaman-balkesh-portfolio-2026.pdf`.

| Property | Result |
| --- | --- |
| Source | 13,490,293 bytes |
| Web copy | 6,926,097 bytes |
| Reduction | 48.7% |
| Pages | 31, all 1440 × 810 PDF units |
| Modified image streams | 16 JPEG images |
| Re-encoding | Quality 86, maximum dimension 1920 px; only kept when materially smaller |
| Page dimensions and extracted text | Compared on every page with an independent PDF reader |
| Annotations | All four preserved and compared |

The optimizer changes large, unmasked JPEG images, preserving PDF page content and fonts. Smaller or masked images are left untouched. This is a web viewing copy; keep the original for future high-resolution exports.

`output/pdf/optimization-report.json` records exact byte counts, hashes and image replacements. All 31 pages were rendered into a review sheet, and representative detailed pages were visually compared with the original before delivery.

To reproduce from a separate original:

```powershell
npm.cmd run prepare:portfolio -- "C:\path\to\original.pdf"
npm.cmd run build
```

This rewrites the web copy, report and cover, and produces temporary comparison PNGs in `tmp/pdfs/`. Review the new pages whenever the source changes. The site derives the page count and size from the report, so it does not hard-code a second copy of those values.

## Files and loading

- `src/sections/Portfolio.jsx` and `src/styles/portfolio-feature.css`: home feature.
- `src/data/portfolio.js`: asset URL, cover and shared metadata.
- `portfolio/index.html` and `src/portfolio-main.jsx`: independent Vite entry, built to `dist/portfolio/index.html` for direct static-host access.
- `src/pages/PortfolioViewer.jsx`: navigation, document lifecycle, loading/recovery and viewport fitting.
- `src/components/portfolio/PdfPage.jsx`: cancellable canvas/text rendering and external link overlays.
- `src/styles/portfolio.css`: viewer surface and PDF text-layer layout.
- `scripts/prepare-portfolio.mjs`: repeatable compression and independent validation.

Vite imports the PDF as an asset URL. The home page downloads only the 27 KB cover, not the PDF, worker or rendering engine. The viewer dynamically loads PDF.js, with a local worker asset and no third-party PDF service. Image decoding uses the JavaScript fallback for this JPEG-based document, so no separate WASM resource is needed. Rendering follows the [official PDF.js examples](https://mozilla.github.io/pdf.js/examples/) and installed package types.

Deploy the entire `dist/` directory, including `portfolio/` and `assets/`. For a repository subpath, use the same explicit Vite base for both entries, for example `npm.cmd run build -- --base=/repository-name/`.

## Verification

- Production build passed.
- Initial full Chromium suite: 21 passed, one intentional desktop skip for the mobile-only navigation test. After the fit-page update, all ten portfolio cases passed across desktop and mobile projects, including full-page visibility, resizing, zoom scrolling and reset at 1920×970, 1366×768, 844×390 and 320×700.
- Bootstrap suite: nine passed.
- Portfolio checks include home asset isolation and ordering, direct loading/refresh, deep pages, zoom/reset, full-page fitting, last-page links/text, keyboard navigation, fullscreen, 320px controls and recovery after an aborted PDF request.
- Desktop and mobile screenshots were reviewed in one batch, followed by one confirmation after corrections.
- Impeccable detector returned no findings for the new UI files.

Native iOS/Safari, Firefox, real-device memory and field performance have not been measured. The direct PDF link remains available for the browser's own reader.
