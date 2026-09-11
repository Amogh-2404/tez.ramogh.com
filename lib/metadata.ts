import type { Metadata } from 'next';
import site from '@/site.config.json';

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const image = '/docs-assets/tez-social.png';
  return {
    metadataBase: new URL(site.origin),
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
      images: [
        {
          url: image,
          width: 1280,
          height: 640,
          alt: 'Tez — a compact C++17 HTTP server',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
