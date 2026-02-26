# Portfolio

Personal portfolio built with React + Vite.

## Stack
- React
- React Router
- Vite
- Tailwind CSS

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Content updates
- Main content lives in:
  - `src/data/about.json`
  - `src/data/projects.json`
- Public assets (images, videos, resumes) live in `public/`.
- Use root-relative asset paths in JSON (example: `/media/demo.mp4`).

## Deploy (GitHub Pages via Actions)
This repo deploys using:
- `.github/workflows/deploy.yml`

The workflow:
1. Installs dependencies
2. Builds with the correct `BASE_PATH`
3. Deploys to GitHub Pages

It auto-handles:
- project pages (`/<repo>/`)
- user pages root (`/`) when repo name is `<username>.github.io`

## Important routing note
This app includes GitHub Pages SPA fallback files:
- `public/404.html`
- script in `index.html`

These are required so refreshing deep routes like `/projects/<slug>` works on Pages.
