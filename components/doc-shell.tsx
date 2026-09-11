'use client';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
type NavItem = { slug: string; label: string; group: string };
export function DocShell({
  items,
  active,
  children,
}: {
  items: NavItem[];
  active: string;
  children: ReactNode;
}) {
  const groups = [...new Set(items.map((item) => item.group))];
  const links = (
    <nav aria-label="Documentation">
      {groups.map((group) => (
        <div className="doc-nav-group" key={group}>
          <p>{group}</p>
          {items
            .filter((item) => item.group === group)
            .map((item) => (
              <a
                key={item.slug}
                href={
                  item.slug === 'getting-started'
                    ? '/docs'
                    : `/docs/${item.slug}`
                }
                aria-current={active === item.slug ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
        </div>
      ))}
      <a href="/workbench" className="doc-workbench-link">
        Route workbench ↗
      </a>
    </nav>
  );
  return (
    <SidebarProvider className="doc-shell section-shell">
      <Sidebar collapsible="none" className="doc-sidebar">
        <SidebarContent>{links}</SidebarContent>
      </Sidebar>
      <details className="doc-mobile-nav">
        <summary>Browse documentation</summary>
        {links}
      </details>
      {children}
    </SidebarProvider>
  );
}
