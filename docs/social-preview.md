# Social link previews

The home page and portfolio viewer provide sharing metadata directly in their initial HTML, so crawlers can read it without running React. Both include Open Graph, Twitter `summary_large_image`, and canonical URLs.

| Page | HTML source | Public URL |
| --- | --- | --- |
| Home | `index.html` | https://design-man.me/ |
| Portfolio viewer | `portfolio/index.html` | https://design-man.me/portfolio/ |

Both pages use https://design-man.me/social/design-man-preview-v1.jpg: a 1200 × 630 JPEG (160,513 bytes at implementation). It reuses the existing hero artwork, robot mascot, logo, dark background, and neon accent; it introduces no new visual system.

## Maintenance

- Update each page's title, description, Open Graph, and Twitter fields together. Keep its canonical and `og:url` pointed at the corresponding public page.
- Keep image URLs absolute and HTTPS. The declared MIME type, dimensions, and alternative text must match the image.
- Regenerate the committed image from the repository root with `node scripts/prepare-social-image.mjs`. The script uses the installed `@napi-rs/canvas`, `src/assets/images/optimized/hero-bg.jpg`, and `brand-logo-strip.png`; it makes no network requests and adds no browser runtime dependency.
- The output is `public/social/design-man-preview-v1.jpg`. Inspect the full image and a 600 × 315 view after edits. For a replacement, use a new versioned filename and update `og:image`, `og:image:secure_url`, and `twitter:image` in both HTML files.

Reference: [Open Graph protocol](https://ogp.me/).

## Verification and deployment status

Implementation checks on 2026-11-13:

- Production build passed.
- Production-preview HTTP requests to both pages using WhatsApp, Facebook, and Twitter user agents found the metadata in raw HTML.
- The preview image returned HTTP 200 with `image/jpeg`; decoded dimensions were 1200 × 630.
- Visual review accepted the image at its original size and 600 × 315.

These are HTTP checks with crawler user agents, not confirmation of an actual WhatsApp app preview. During pre-publication verification, the public domain returned HTTP 200 to a Facebook crawler request, but its HTML still lacked the new Open Graph tags. Live deployment and the actual platform preview require the post-deployment checks below.

After deployment, fetch both public pages as crawlers and confirm the metadata remains in the first HTML response. Fetch the public image URL and confirm HTTP 200, `image/jpeg`, and decoded dimensions. Then share each page in WhatsApp and inspect the actual card. Cached previews may require a fresh scrape or a versioned image URL after changes.
