'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CopyButton } from '@/components/copy-button';
export function DocCodeTools() {
  const [blocks, setBlocks] = useState<HTMLElement[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setBlocks(
        Array.from(document.querySelectorAll<HTMLElement>('.doc-article pre')),
      ),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  return blocks.map((block, index) =>
    createPortal(
      <CopyButton
        text={block.querySelector('code')?.textContent || ''}
        label="Copy code"
      />,
      block,
      `code-${index}`,
    ),
  );
}
