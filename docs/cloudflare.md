# Cloudflare Workers deployment

This repository is a static React 19 / Vite 7 application. Vite builds two HTML entries: the main website and the independent portfolio PDF viewer. It has no SSR, API Worker, Pages Functions or Cloudflare Vite plugin to preserve.

## Configuration boundary

Root cause reproduced with Wrangler 4.158.0: without a Wrangler config, automatic Vite setup passes `vite.config.js` through its JavaScript AST parser (Esprima). That parser rejects the valid `import.meta.url` expressions used to resolve this project's two HTML entries. `node --check vite.config.js` passes. In an isolated copy, `wrangler setup --dry-run --yes` reproduces `Error parsing file: .../vite.config.js`; replacing only `import.meta.url` in that temporary copy gets past the parser and reaches framework detection. The original Vite configuration is preserved.

Providing `wrangler.jsonc` explicitly bypasses automatic project setup and deploys the already-built assets. This fixes the demonstrated parsing failure without rewriting the working multi-page Vite configuration or adding a Cloudflare Vite plugin.

`vite.config.js` is executable JavaScript for Vite. Wrangler's `--config` option expects its own JSON, JSONC or TOML configuration, not a Vite configuration file. Keep Vite's existing multi-page build intact. The deployment configuration is `wrangler.jsonc`.

The Worker name is `design-man`, matching the existing production URL in this repository. If your connected Cloudflare Worker has a different name, update only `name` in `wrangler.jsonc` to match it.

Wrangler serves the built `dist/` assets directly; no custom Worker entry point or additional runtime binding is needed. HTML routing preserves `/portfolio/` and the homepage's hash links. Missing assets return 404 rather than the homepage, which avoids hiding failed PDF, worker or JavaScript requests behind HTML responses.

Wrangler 4.158.0 is pinned as a development tool. The website's runtime dependencies and source code are unchanged by this deployment setup. `.wrangler/` and local `.dev.vars` files are excluded from Git.

## Cloudflare dashboard

Open **Workers & Pages → design-man → Settings → Build** and use:

| Setting | Value |
| --- | --- |
| Repository | `nasermaaz-20/design-man-portfolio` |
| Production branch | `main` |
| Root directory | Repository root, `.` (or leave blank) |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Node version | `24`, matching the existing GitHub Actions build |
| Built assets directory | `dist`, configured in `wrangler.jsonc` |

Workers Builds installs dependencies before the build command. It does not need a separate Pages-style output-directory setting; Wrangler reads `assets.directory`. Keep the build root at the repository root, not `src`, `portfolio` or `dist`.

Remove any deploy-command argument that points `--config` or `-c` at `vite.config.js`. The explicit equivalent of `npm run deploy` is:

```bash
npx wrangler deploy --config wrangler.jsonc
```

If non-production branch builds are enabled, use `npx wrangler versions upload --config wrangler.jsonc` for their deploy command. This uploads a version without promoting it to production.

No new API token is needed for local validation. For a real deployment, use the existing Workers Builds deployment token, or authenticate locally with `npx wrangler login` and use an account that can update `design-man`.

## Local verification and deployment

```bash
npm ci
npm run build
npm run deploy:check
```

`deploy:check` runs `wrangler deploy --config wrangler.jsonc --dry-run`. It validates and prepares the deployment without uploading or activating a production version. It does not prove authentication, account permissions or a live deployment.

For local Cloudflare routing verification after building:

```bash
npx wrangler dev --config wrangler.jsonc --ip 127.0.0.1 --port 8787
```

Check `/`, `/portfolio/`, the generated PDF URL and the PDF worker URL. Both HTML entries and all their referenced assets must be present under `dist/`. The configured `dist/` directory is the only upload source; source files, the original PDF and `node_modules` are not uploaded as site assets.

After authentication, a manual live deployment is:

```bash
npm run build
npm run deploy
```

For a Git-connected Worker, push these configuration changes and rerun the Cloudflare build with the dashboard settings above. GitHub Actions also runs the deployment dry run after its existing production build.

## Validation results — 2026-11-09

Verified locally with Node 22.22.3 and Wrangler 4.158.0; the existing CI and documented dashboard use Node 24.

- Dependencies: Wrangler installation completed; `npm ci --dry-run --ignore-scripts` accepted the updated lockfile without changing the running development installation. This is a lockfile/install-plan check, not a clean-install execution.
- `node --check vite.config.js`: passed.
- `npm run build`: passed, using the unchanged Vite configuration.
- Output verification: both HTML entries, their 17 local asset references, the PDF, PDF worker, viewer bundle and rendering-engine bundle exist under `dist/`.
- `npm run deploy:check`: passed. Wrangler read 31 static asset files and exited successfully with `--dry-run: exiting now`; no authentication or production upload was performed.
- `wrangler dev --config wrangler.jsonc --local`: started successfully. Chromium checks at 1440px and 390px verified HTTP 200 for the homepage and `/portfolio/`, page 16 PDF rendering, next-page navigation and no browser page errors. The served PDF's SHA-256 matched the built file, the PDF worker had a JavaScript content type, and a missing asset returned 404.
- No live deployment was attempted. The new GitHub Actions validation step will run after these changes are pushed; it has not been run remotely as part of this local verification.

Only deployment tooling, configuration, CI and documentation changed. `vite.config.js`, `src/`, portfolio content and visual assets remain unchanged.
