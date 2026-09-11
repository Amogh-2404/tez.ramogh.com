# Tez website

The [website and documentation](https://tez.ramogh.com) for [Tez](https://github.com/Amogh-2404/Tez), maintained by R. Amogh.

The site is a static export. Reading the documentation needs no application backend; the route workbench runs entirely in the browser. Exported configuration is validated against the same constrained schema documented in the interface.

## Develop

Use Node.js 24 LTS and npm:

```sh
npm ci --ignore-scripts
npm run dev
```

Stop the development server with Ctrl-C. Native links intentionally perform document navigation. The imported UI primitives are kept unchanged; lint checks focus on the application and its scripts.

## Verify and build

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run check
```

The build exports all pages to `dist/client`, then generates the sitemap and robots file. `check` verifies page headings, canonical URLs, and local links, assets, and fragments. No benchmark numbers are inferred from build or test timings.

## Update the documentation

Keep a Tez checkout beside this repository, then run:

```sh
npm run sync-docs -- ../Tez
```

The source Markdown, generated HTML, diagrams, and exact source revision are checked in. The getting-started guide is maintained in `content/guides/getting-started.md`; other guides come from the Tez repository. Review the generated diff, rebuild, and run checks before publishing.

## Publish

The hosting project is recorded in `.openai/hosting.json`. Package only `dist/client`; no server bundle, development tools, credentials, or local environment files belong in the deployment. The site origin in `site.config.json` controls canonical URLs and sitemap entries.

The build toolchain stays pinned in `package-lock.json`. Vinext bundles an upstream image-dimension parser with known malformed-image limitations; only trusted checked-in assets are used, and no image upload or server-side image processing is deployed. A clean package audit does not prove that every bundled upstream code path is vulnerability-free.

## Design

See [PRODUCT.md](PRODUCT.md) for product scope, design intent, and the next evidence required before making performance claims.

[MIT licensed](LICENSE).
