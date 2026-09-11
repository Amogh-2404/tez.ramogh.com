import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const site = JSON.parse(
  await readFile(resolve(root, 'site.config.json'), 'utf8'),
);
const { docs } = JSON.parse(
  await readFile(resolve(root, 'content/docs.json'), 'utf8'),
);
const paths = [
  '/',
  '/workbench',
  ...docs.map((doc) =>
    doc.slug === 'getting-started' ? '/docs' : `/docs/${doc.slug}`,
  ),
];
const origin = site.origin.replace(/\/$/, '');
await writeFile(
  resolve(root, 'dist/client/robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  resolve(root, 'dist/client/sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('') +
    '</urlset>\n',
);
console.log(`Wrote sitemap for ${paths.length} pages.`);
