# Cosmetic Tattoo Artist Portfolio

A personal portfolio website for a Cosmetic Tattoo Artist. The site presents selected treatment work, specialties, client testimonials, and information about the artist and the treatment process.

## Built with

- React and TypeScript
- Vite
- GSAP and Framer Motion
- Tailwind CSS
- Lenis smooth scrolling

## Getting started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`. The `preview` command serves that build locally.

## Project structure

```text
public/
  images/       Portfolio photographs and videos
src/            Application source code
index.html      Vite entry page
vite.config.ts  Vite configuration
```

Keep the files in `public/images/` in place: the portfolio references them directly by their public paths.

## Deployment

This is a Vite static site and can be deployed through a Git-connected hosting provider such as Netlify. Use `npm run build` as the build command and `dist` as the publish directory.
