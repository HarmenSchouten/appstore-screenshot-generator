/**
 * GradientCSSField — the background as CSS: mirrors the visual controls,
 * and commits what the user types on blur or Enter.
 */

import { useState } from "react";
import { cn } from "@ui/utils/cn.ts";

interface GradientCSSFieldProps {
  /** What currently drives the output — the visual controls' CSS or the raw override. */
  css: string;
  /** The raw override is active and the visual controls are ignored. */
  isOverride: boolean;
  onCommit: (css: string) => void;
}

export function GradientCSSField(
  { css, isOverride, onCommit }: GradientCSSFieldProps,
) {
  // A draft exists only while the field has focus; the rest of the time the
  // field shows `css`, so nothing has to sync it when the controls change
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft !== null && draft !== css) onCommit(draft);
    setDraft(null);
  };

  return (
    <div>
      <label className="text-xs text-zinc-500 block mb-1.5">CSS</label>
      <textarea
        value={draft ?? css}
        onFocus={() => setDraft(css)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            commit();
          }
        }}
        spellCheck={false}
        rows={2}
        placeholder="linear-gradient(135deg, #a855f7, #0a0a0a)"
        className={cn(
          "input font-mono text-xs resize-y",
          isOverride && "border-amber-500/50 focus:border-amber-400",
        )}
      />
      {isOverride && (
        <p className="text-[10px] text-amber-500/70 mt-1.5">
          <i className="fa-solid fa-pen-fancy mr-1" />
          Custom CSS active — visual controls won't apply until reset.
        </p>
      )}
    </div>
  );
}
