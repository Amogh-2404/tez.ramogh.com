import type { Metadata } from 'next';
import { Workbench } from '@/components/workbench';
import { RunFixture } from '@/components/run-fixture';
export const metadata: Metadata = {
  title: 'Route workbench — Tez',
  alternates: { canonical: '/workbench' },
  openGraph: { title: 'Route workbench — Tez', url: '/workbench' },
  description:
    'Create a fixed HTTP response, export valid Tez configuration, and try it locally. Everything stays in your browser.',
};
export default function WorkbenchPage() {
  return (
    <main id="main" className="workbench-page section-shell">
      <div className="page-intro">
        <p className="eyebrow">CONFIGURATION</p>
        <h1>
          Route <span>workbench</span>
        </h1>
        <p>
          Set a path, status, content type, and body, then download routes.json.
        </p>
        <p className="page-note">
          Runs entirely in your browser. This generates configuration; it does
          not run a Tez server or send requests.
        </p>
      </div>
      <Workbench />
      <RunFixture />
    </main>
  );
}
