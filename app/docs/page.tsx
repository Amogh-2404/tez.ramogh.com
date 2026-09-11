import type { Metadata } from 'next';
import { DocPage } from '@/components/doc-page';
export const metadata: Metadata = {
  title: 'Get started — Tez',
  alternates: { canonical: '/docs' },
  openGraph: { title: 'Get started — Tez', url: '/docs' },
  description:
    'Run Tez locally with Docker or build the C++ source. Validate a configuration, serve a fixture, and inspect your first response.',
};
export default function Page() {
  return <DocPage slug="getting-started" />;
}
