# DESIGN-MAN Portfolio

> A premium, motion-driven portfolio website for **Yaman Balkesh** — Graphic Designer specializing in brand identity, social media systems, packaging, and advertising campaigns.

**Website development:** [Naser Maaz](https://github.com/nasermaaz-20) — independently implemented the complete website.  
**Portfolio owner & graphic design work:** Yaman Balkesh.

[Live website](https://design-man.naser-nsrfnz2000.workers.dev/) · [Developer portfolio](https://portfolio.nasermaaz20.workers.dev/)

<p align="center">
  <a href="https://www.behance.net/jeffpunky5j"><img src="https://img.shields.io/badge/Behance-1769FF?style=for-the-badge&logo=behance&logoColor=white" alt="Behance" /></a>
  <a href="https://www.linkedin.com/in/yaman-balkesh"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://www.instagram.com/designman7580"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Lenis-1.3-00F5D4?style=flat-square" alt="Lenis" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Highlights](#key-highlights)
- [Features](#features)
- [Featured Work](#featured-work)
- [Tech Stack](#tech-stack)
- [Architecture & UX Decisions](#architecture--ux-decisions)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deploy to GitHub Pages](#deploy-to-github-pages)
- [Customization](#customization)
- [Author & Contact](#author--contact)
- [License](#license)

---

## Overview

**DESIGN-MAN** is a single-page creative portfolio built to present a designer's work with a luxury dark aesthetic, cinematic motion, and a conversion-focused layout. The site combines bold visual storytelling with a clean, professional structure — ideal for attracting clients, showcasing case studies, and standing out in job applications.

The interface reflects the designer's own brand language: neon accents, cyber-inspired typography, and high-impact project presentation.

---

## Live Demo

| Environment | URL |
|-------------|-----|
| **Production** | https://design-man.naser-nsrfnz2000.workers.dev/ |
| **Local** | [http://127.0.0.1:5173](http://127.0.0.1:5173) |


<!-- Uncomment and update after adding a screenshot to /public/preview.png or /docs/preview.png
<p align="center">
  <img src="./docs/preview.png" alt="DESIGN-MAN Portfolio Preview" width="900" />
</p>
-->

---

## Key Highlights

Why this project works well as a **professional portfolio**:

| Area | What it demonstrates |
|------|----------------------|
| **Visual Identity** | Cohesive dark theme, custom typography (Orbitron, Exo 2, JetBrains Mono), and neon glow system |
| **Case Study UX** | Interactive project modal with challenge / solution / deliverables structure |
| **Motion Design** | GSAP scroll animations, Framer Motion micro-interactions, Lenis smooth scrolling |
| **Performance** | Vite build pipeline, responsive `<picture>` elements, lazy-loaded assets |
| **Accessibility** | Semantic HTML, ARIA labels on modals and social links, keyboard-friendly navigation |
| **Business Focus** | Services, process, stats, testimonials, and WhatsApp CTA for lead generation |

---

## Features

- **Hero Section** — Full-screen intro with animated headline, service tags, and social links
- **Selected Work** — Curated project gallery with hover effects and detailed modal views
- **Services** — Brand Identity, Social Media, Packaging, and Advertising Campaigns
- **About** — Professional bio with experience badges (5+ years, 50+ projects)
- **Process** — Step-by-step workflow explanation for client transparency
- **Stats** — Animated counters (projects, clients, countries, delivery time)
- **Testimonials** — Social proof from clients and collaborators
- **Final CTA** — Direct WhatsApp contact for project inquiries
- **Custom Cursor** — Desktop-only interactive cursor (disabled on mobile)
- **Ambient Effects** — Scan lines, circuit backgrounds, and glow cards
- **Fully Responsive** — Optimized layouts for mobile, tablet, and desktop

---

## Featured Work

| Project | Category | Link |
|---------|----------|------|
| **EAST** | Visual Identity / Branding | [Behance](https://www.behance.net/gallery/248596401/EAST-Entertiment) |
| **TrapNet** | UI/UX / Social Media | [Behance](https://www.behance.net/gallery/245872409/TrapNet) |
| **The Royal Camel** | Magazine / Book Design | [Behance](https://www.behance.net/gallery/248587735/The-Royal-Camel) |
| **Happy Bun** | Visual Identity / Logo | [Behance](https://www.behance.net/gallery/248210421/Happy-Bun) |
| **Veloure** | UI/UX / Visual Identity | [Behance](https://www.behance.net/gallery/241040849/Veloure) |

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | React 19, Vite 7, JavaScript (JSX) |
| **Styling** | Tailwind CSS 3, PostCSS, Autoprefixer, tailwindcss-animate |
| **Animation** | GSAP 3, @gsap/react, Framer Motion 12, Lenis |
| **Icons** | React Icons |
| **Routing** | React Router DOM 7 |
| **Utilities** | clsx |

---

## Architecture & UX Decisions

- **Component-based structure** — Sections, layout, UI, and background layers are separated for maintainability
- **Data-driven content** — Projects, services, stats, and testimonials live in `src/data/` for easy updates without touching UI code
- **Custom hooks** — `useLenis` for smooth scroll, `useScrollAnimation` for reveal-on-scroll effects
- **Modal scroll lock** — Body overflow is managed when project modals are open
- **Mobile-first images** — Hero uses `<picture>` with separate desktop and mobile optimized assets
- **Design tokens** — Colors, fonts, shadows, and animations are centralized in `tailwind.config.js`

---

## Project Structure

```
design-man-portfolio/
├── public/                  # Static assets (favicons, manifest)
├── src/
│   ├── assets/images/       # Project images and portraits
│   ├── components/
│   │   ├── background/      # ScanLines, CircuitLines, AmbientGlow
│   │   ├── layout/          # Navbar, Footer
│   │   └── ui/              # Button, GlowCard, ProjectModal, etc.
│   ├── data/                # projects, services, stats, testimonials, process
│   ├── hooks/               # useLenis, useScrollAnimation
│   ├── sections/            # Hero, SelectedWork, About, Services, etc.
│   ├── styles/              # globals.css, animations.css
│   ├── utils/               # cn (className helper)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18+**
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/nasermaaz-20/design-man-portfolio.git
cd design-man-portfolio

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

The optimized output will be in the `dist/` folder.

---

## Deploy to GitHub Pages

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: DESIGN-MAN portfolio"
git branch -M main
git remote add origin https://github.com/nasermaaz-20/design-man-portfolio.git
git push -u origin main
```

### 2. Configure Vite base path

If deploying to `https://nasermaaz-20.github.io/design-man-portfolio/`, update `vite.config.js`:

```js
export default defineConfig({
  base: '/design-man-portfolio/',
  plugins: [react()],
});
```

### 3. Deploy with GitHub Actions (recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

Then enable **GitHub Pages** in your repo settings → **Source: GitHub Actions**.

### Alternative: Vercel / Netlify

Connect your GitHub repo to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) for automatic deployments on every push — no base path configuration needed.

---

## Customization

| What to change | Where |
|----------------|-------|
| Projects & case studies | `src/data/projects.js` |
| Services | `src/data/services.js` |
| Stats & numbers | `src/data/stats.js` |
| Testimonials | `src/data/testimonials.js` |
| Process steps | `src/data/process.js` |
| Section copy | `src/sections/*.jsx` |
| Colors & theme | `tailwind.config.js` + `src/styles/globals.css` |
| Social links & contact | `src/sections/Hero.jsx`, `src/sections/FinalCTA.jsx` |
| SEO title & description | `index.html` |

---

## Author & Contact

### Website developer

**[Naser Maaz](https://github.com/nasermaaz-20)** — complete website implementation, including the React interface, responsive layouts, animation integration, and project presentation.

[Developer portfolio](https://portfolio.nasermaaz20.workers.dev/) · [LinkedIn](https://www.linkedin.com/in/naser-maaz)

### Portfolio owner & graphic designer

**Yaman Balkesh** — Graphic Designer

| Platform | Link |
|----------|------|
| Behance | [behance.net/jeffpunky5j](https://www.behance.net/jeffpunky5j) |
| LinkedIn | [linkedin.com/in/yaman-balkesh](https://www.linkedin.com/in/yaman-balkesh) |
| Instagram | [@designman7580](https://www.instagram.com/designman7580) |
| WhatsApp | [+963 940 808 403](https://wa.me/963940808403) |

---

## License

This project is open for **personal and professional portfolio use**.  
If you fork or republish it, please credit the original author and replace all personal content, images, and branding with your own.

---

<p align="center">
  <strong>Built with precision. Designed to stand out.</strong><br />
  <sub>DESIGN-MAN © 2026</sub>
</p>
