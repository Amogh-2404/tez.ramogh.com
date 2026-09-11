import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist/client');
const { docs } = JSON.parse(
  await readFile(resolve(root, 'content/docs.json'), 'utf8'),
);
const site = JSON.parse(
  await readFile(resolve(root, 'site.config.json'), 'utf8'),
);
const paths = [
  '/',
  '/workbench',
  ...docs.map((doc) =>
    doc.slug === 'getting-started' ? '/docs' : `/docs/${doc.slug}`,
  ),
  '/404',
];
const files = new Map();
for (const path of paths)
  files.set(
    path,
    await readFile(
      resolve(output, path === '/' ? 'index.html' : `${path.slice(1)}.html`),
      'utf8',
    ),
  );
let checks = 0;
for (const [path, html] of files) {
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${path}: exactly one h1`,
  );
  assert.ok(
    !/Untitled site|Your site is taking shape|Building your site/.test(html),
    `${path}: no starter content`,
  );
  assert.ok(html.includes('Skip to content'), `${path}: skip link`);
  if (path !== '/404') {
    const canonical = html.match(
      /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/,
    );
    assert.ok(canonical, `${path}: canonical tag`);
    assert.equal(
      new URL(canonical[1]).href,
      new URL(path, site.origin).href,
      `${path}: canonical URL`,
    );
  }
  for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(href, 'https://check.invalid' + path);
    const clean = url.pathname.replace(/\/$/, '') || '/';
    if (files.has(clean)) {
      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(
          files.get(clean).includes(`id="${id}"`),
          `${path}: missing ${href}`,
        );
      }
    } else {
      assert.ok(!url.pathname.includes('..'), `${path}: invalid asset path`);
      await stat(resolve(output, '.' + url.pathname)).catch(() => {
        throw new Error(`${path}: missing local asset ${href}`);
      });
    }
    checks++;
  }
}
assert.ok(
  (await readFile(resolve(output, 'robots.txt'), 'utf8')).includes(
    `${site.origin}/sitemap.xml`,
  ),
);
console.log(
  `Checked ${files.size} static pages and ${checks} local links/assets.`,
);
