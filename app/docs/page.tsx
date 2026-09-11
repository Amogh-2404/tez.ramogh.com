import type { Metadata } from 'next';
import { DocPage } from '@/components/doc-page';
import { pageMetadata } from '@/lib/metadata';
export const metadata: Metadata = pageMetadata(
  'Get started — Tez',
  'Run Tez locally with Docker or build the C++ source. Validate a configuration, serve a fixture, and inspect your first response.',
  '/docs',
);
export default function Page() {
  return <DocPage slug="getting-started" />;
}
