/** Subtle section heading with a divider line — reusable across all editors. */
export function SectionHeading({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 pt-2 first:pt-0">
      <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 shrink-0">
        {children}
      </span>
      <div className="h-px flex-1 bg-zinc-700/50" />
    </div>
  );
}
