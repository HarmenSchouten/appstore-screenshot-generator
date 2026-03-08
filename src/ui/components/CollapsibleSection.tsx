/**
 * CollapsibleSection Component
 * 
 * Collapsible section with header and content area.
 */

import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ComponentChildren;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div class="border border-zinc-800 rounded-lg overflow-hidden">
      <div
        class="section-header flex items-center justify-between px-3 py-2 bg-zinc-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 class="text-sm font-medium text-zinc-300">{title}</h3>
        <i
          class={`fa-solid fa-chevron-down text-zinc-400 text-xs transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && <div class="p-3 space-y-3 bg-zinc-900/50">{children}</div>}
    </div>
  );
}
