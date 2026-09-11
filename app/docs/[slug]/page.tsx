import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import data from '@/content/docs.json';
import { DocPage } from '@/components/doc-page';
import { pageMetadata } from '@/lib/metadata';
export const dynamicParams = false;
export function generateStaticParams() {
  return data.docs
    .filter((doc) => doc.slug !== 'getting-started')
    .map((doc) => ({ slug: doc.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = data.docs.find((item) => item.slug === slug);
  if (!doc) notFound();
  return pageMetadata(`${doc.label} — Tez`, doc.description, `/docs/${slug}`);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!data.docs.some((doc) => doc.slug === slug)) notFound();
  return <DocPage slug={slug} />;
}
