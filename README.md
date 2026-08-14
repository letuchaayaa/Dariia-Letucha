# Dariia Letucha — Portfolio

Final source project for Dariia Letucha's portfolio website.

## Included

- Home page with the helmet and animated project spiral
- Projects catalogue and individual project pages
- About page and all interactive sections
- Get in touch page
- Embedded PayrollBien website
- All images, videos, fonts, and responsive layouts

## Local preview

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local address printed in the terminal.

## Production build

```bash
npm install
npm run build
```

The production output is generated in `dist/`.

## Hosting through GitHub

Upload the contents of this folder to the root of a GitHub repository, then connect that repository to a host that supports Node.js/Cloudflare Worker builds. Use:

- Build command: `npm run build`
- Node.js version: `22.13` or newer

This project is not a plain GitHub Pages site: it must be built by the hosting platform.
