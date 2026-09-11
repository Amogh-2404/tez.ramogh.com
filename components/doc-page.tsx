import docsData from '@/content/docs.json';
import { DocShell } from '@/components/doc-shell';
import { DocCodeTools } from '@/components/doc-code-tools';
export function DocPage({ slug }: { slug: string }) {
  const doc = docsData.docs.find((item) => item.slug === slug)!;
  const items = docsData.docs.map(({ slug, label, group }) => ({
    slug,
    label,
    group,
  }));
  const position = docsData.docs.findIndex((item) => item.slug === slug);
  const next = docsData.docs[position + 1];
  return (
    <main id="main" className="docs-page">
      <DocShell items={items} active={slug}>
        <article className="doc-article">
          <header className="doc-header">
            <p className="eyebrow">
              DOCUMENTATION / {String(position + 1).padStart(2, '0')}
            </p>
            <h1>{doc.title}</h1>
            <div className="doc-meta">
              <span>Tez 1.1.0-dev</span>
              {doc.source && (
                <a href={doc.source}>
                  Source {docsData.sourceRevision.slice(0, 7)} ↗
                </a>
              )}
            </div>
          </header>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
          <DocCodeTools />
          {next && (
            <a className="doc-next" href={`/docs/${next.slug}`}>
              <span>CONTINUE READING</span>
              <strong>{next.label} ↗</strong>
            </a>
          )}
        </article>
        <aside className="doc-toc">
          <p>ON THIS PAGE</p>
          <nav aria-label="On this page">
            {doc.toc.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      </DocShell>
    </main>
  );
}
