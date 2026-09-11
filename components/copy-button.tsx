'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function CopyButton({
  text,
  label = 'Copy',
}: {
  text: string;
  label?: string;
}) {
  const [feedback, setFeedback] = useState({ text: '', message: '' });
  const status = feedback.text === text ? feedback.message : '';
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback({ text, message: 'Copied' });
    } catch {
      setFeedback({ text, message: 'Select the text to copy' });
    }
  }
  return (
    <span className="copy-control">
      <Button
        type="button"
        variant="ghost"
        onClick={copy}
        className="copy-button"
        aria-label={label}
      >
        {status === 'Copied' ? <Check size={14} /> : <Copy size={14} />}
        <span>{status || label}</span>
      </Button>
      <output className="sr-only">{status}</output>
    </span>
  );
}
