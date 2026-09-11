import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import './globals.css';
import site from '@/site.config.json';

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: 'Tez — C++ HTTP server',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Tez — C++ HTTP server',
    description: site.description,
    type: 'website',
    url: site.origin,
    images: [
      {
        url: '/docs-assets/tez-social.png',
        width: 1280,
        height: 640,
        alt: 'Tez — a compact C++17 HTTP server',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tez — C++ HTTP server',
    description: site.description,
    images: ['/docs-assets/tez-social.png'],
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header section-shell">
          <a href="/" className="wordmark" aria-label="Tez home">
            tez<span aria-hidden="true">↗</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="/docs">Docs</a>
            <a href="/workbench">Workbench</a>
            <a href="https://github.com/Amogh-2404/Tez" className="source-link">
              GitHub <ArrowUpRight size={15} />
            </a>
          </nav>
          <span className="version-label">1.1.0-dev</span>
        </header>
        {children}
        <footer className="site-footer section-shell">
          <a href="/" className="wordmark">
            tez<span aria-hidden="true">↗</span>
          </a>
          <p>
            <a href="https://ramogh.com">R. Amogh</a>
          </p>
          <div>
            <a href="https://github.com/Amogh-2404/Tez/blob/main/LICENSE">
              MIT licensed
            </a>
            <a href="https://github.com/Amogh-2404/Tez/security/policy">
              Security
            </a>
            <a href="https://hub.docker.com/r/ramogh2404/tez">Docker Hub ↗</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
