# Dariia Letucha — Portfolio

Cloudflare Workers-ready source for Dariia Letucha's complete portfolio.

## Included

- Home page with the helmet and animated project spiral
- Projects catalogue and individual project pages
- About and Get in touch pages
- Embedded PayrollBien website
- Responsive layouts, images, videos, fonts, and animations

## Cloudflare deployment from GitHub

1. Extract this archive.
2. Upload the **contents** of the extracted folder to the root of a GitHub repository.
3. In Cloudflare, open **Workers & Pages → Create → Import a repository**.
4. Select the repository.
5. Use `pnpm run deploy` as the deploy command. Leave the separate build command empty.

Cloudflare reads `wrangler.jsonc`, builds the complete site first, and then deploys it as a Worker with static assets. Node.js 22 is selected through `.node-version`.

## Local check

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

## Production check

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm run deploy:check
```

Do not upload `node_modules`, `dist`, `.vinext`, `.wrangler`, or an older generated archive to the repository.
