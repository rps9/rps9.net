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
- FastAPI API running in Docker on EC2, with Nginx reverse proxying requests to the container.
- Certbot + Let's Encrypt for TLS certificates, with automated renew checks.

## Project Structure

- `src/` - Application pages, components, and utilities
- `public/` - Static public assets
- `dist/` - Production build output
