import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, basename } from 'node:path';
import { Marked } from 'marked';
import markedFootnote from 'marked-footnote';
const core = resolve(process.argv[2] || '../Tez');
const root = resolve(import.meta.dirname, '..');
const sources = [
  [
    'getting-started',
    'Get started',
    'Start here',
    'content/guides/getting-started.md',
  ],
  ['recipes', 'Fixture recipes', 'Start here', 'examples/fixtures/README.md'],
  ['configuration', 'Configuration', 'Reference', 'docs/configuration.md'],
  ['deployment', 'Containers & deployment', 'Reference', 'docs/deployment.md'],
  ['architecture', 'How it works', 'Under the hood', 'docs/architecture.md'],
  [
    'engineering',
    'Engineering decisions',
    'Under the hood',
    'docs/engineering.md',
  ],
  [
    'performance',
    'Performance evidence',
    'Under the hood',
    'docs/performance.md',
  ],
  ['contributing', 'Contributing', 'Project', 'CONTRIBUTING.md'],
  ['releases', 'Release process', 'Project', 'docs/releasing.md'],
];
const map = new Map(
  sources
    .slice(1)
    .map(([slug, , , file]) => [resolve(core, file), `/docs/${slug}/`]),
);
map.set(resolve(core, 'README.md'), '/docs/');
const escape = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const sourceRevision = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: core,
  encoding: 'utf8',
}).trim();
const docs = [];
await mkdir(resolve(root, 'public/diagrams'), { recursive: true });
await mkdir(resolve(root, 'public/docs-assets'), { recursive: true });
for (const [slug, label, group, file] of sources) {
  const local = slug === 'getting-started';
  const full = resolve(local ? root : core, file);
  let markdown = await readFile(full, 'utf8');
  await mkdir(resolve(root, 'content/source'), { recursive: true });
  await writeFile(resolve(root, `content/source/${slug}.md`), markdown);
  const title = markdown.match(/^# (.+)$/m)?.[1] || label;
  const toc = [];
  const seen = new Map();
  const marked = new Marked({
    gfm: true,
    async: true,
    async walkTokens(token) {
      if (token.type === 'link' || token.type === 'image')
        token.href = await target(token.href);
    },
    renderer: {
      heading({ tokens, depth, text }) {
        if (depth === 1) return '';
        const base = text
          .toLowerCase()
          .replace(/<[^>]*>/g, '')
          .replace(/[^\p{L}\p{N}\s_-]/gu, '')
          .replace(/\s/g, '-');
        const count = seen.get(base) || 0;
        seen.set(base, count + 1);
        const id = count ? `${base}-${count}` : base;
        const plain = text.replace(/[`*_]/g, '');
        if (depth === 2) toc.push({ id, label: plain });
        return `<h${depth} id="${escape(id)}">${this.parser.parseInline(tokens)}<a class="heading-anchor" href="#${escape(id)}" aria-label="Link to ${escape(plain)}">#</a></h${depth}>\n`;
      },
    },
  });
  marked.use(markedFootnote({ refMarkers: true, keepLabels: true }));
  async function target(href) {
    if (/^(https?:|mailto:|#|\/)/.test(href)) return href;
    const [path, fragment] = href.split('#');
    const absolute = resolve(dirname(full), path);
    if (absolute === resolve(core, 'README.md') && fragment) {
      const aliases = {
        'build-and-run': 'build-from-source',
        'run-in-docker': 'run-with-docker',
      };
      if (aliases[fragment]) return '/docs#' + aliases[fragment];
      return (
        'https://github.com/Amogh-2404/Tez/blob/main/README.md#' + fragment
      );
    }
    if (map.has(absolute))
      return map.get(absolute) + (fragment ? `#${fragment}` : '');
    if (/\.(svg|png)$/.test(path)) {
      const folder = path.includes('diagrams/') ? 'diagrams' : 'docs-assets';
      await copyFile(absolute, resolve(root, 'public', folder, basename(path)));
      return `/${folder}/${basename(path)}`;
    }
    const relative = absolute.slice(core.length + 1);
    return `https://github.com/Amogh-2404/Tez/blob/${sourceRevision}/${relative}${fragment ? `#${fragment}` : ''}`;
  }
  const images = [...markdown.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)];
  for (const match of images)
    markdown = markdown.replace(
      match[0],
      match[0].replace(match[1], await target(match[1])),
    );
  const html = (await marked.parse(markdown)).replace(
    /href="(\/[^"#]*?)\/(?=["#])/g,
    'href="$1',
  );
  const description =
    markdown
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))[0]
      ?.replace(/[`*_]/g, '')
      .slice(0, 180) || `${label} for Tez.`;
  docs.push({
    slug,
    label,
    group,
    title,
    description,
    html,
    toc,
    source: local
      ? null
      : `https://github.com/Amogh-2404/Tez/blob/${sourceRevision}/${file}`,
  });
}
await writeFile(
  resolve(root, 'content/docs.json'),
  JSON.stringify({ sourceRevision, docs }, null, 2) + '\n',
);
console.log(
  `Synced ${docs.length} guides from Tez ${sourceRevision.slice(0, 7)}.`,
);
