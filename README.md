# Ryan's Personal Website

This repository contains the source code for my personal website.

## Live Site

- Primary: [https://rps9.net](https://rps9.net)

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Nginx to serve the website
- Cloudflare (DNS + proxy/CDN)
- FastAPI API running in Docker on the home server, with Nginx proxying API requests.
- Cloudflare Tunnel connects the home server to the public site.

## CI/CD

Pull requests run automated checks and Chromium browser tests. Successful merges
to `main` publish tested builds for the home server's deployment timer.
See [deployment setup and rollback](deploy/README.md) for one-time activation.

## Project Structure

- `src/` - Application pages, components, and utilities
- `public/` - Static public assets
- `dist/` - Production build output
