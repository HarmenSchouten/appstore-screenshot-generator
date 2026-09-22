/**
 * GradientPicker — the template tiles, the raw-CSS escape hatch behind the
 * Custom tile, and the preview of whichever is selected.
 */

import { cn } from "@ui/utils/cn.ts";

interface GradientOption {
  id: string;
  name: string;
  css: string;
}

interface GradientPickerProps {
  gradients: GradientOption[];
  /** A template id, or the `"custom"` sentinel. */
  selected: string;
  custom: string;
  onSelect: (id: string) => void;
  onCustomChange: (css: string) => void;
}

export function GradientPicker({
  gradients,
  selected,
  custom,
  onSelect,
  onCustomChange,
}: GradientPickerProps) {
  const preview = selected === "custom"
    ? custom
    : gradients.find((g) => g.id === selected)?.css || "";

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Background Gradient</h3>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {gradients.map((g) => (
          <GradientTile
            key={g.id}
            css={g.css}
            label={g.name}
            selected={selected === g.id}
            onClick={() => onSelect(g.id)}
          />
        ))}
        <GradientTile
          label="Custom"
          selected={selected === "custom"}
          onClick={() => onSelect("custom")}
        />
      </div>

      {selected === "custom" && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">
            Custom CSS Gradient
          </label>
          <input
            type="text"
            value={custom}
            onInput={(e) =>
              onCustomChange((e.target as HTMLInputElement).value)}
            className="input font-mono"
            placeholder="linear-gradient(135deg, #a855f7 0%, #0a0a0a 100%)"
          />
          <div
            className="mt-2 h-16 rounded"
            style={{ background: custom }}
          />
        </div>
      )}

      {/* Preview */}
      <div className="mt-3">
        <label className="text-xs text-zinc-500 block mb-1">
          Preview
        </label>
        <div
          className="h-20 rounded"
          style={{ background: preview }}
        />
      </div>
    </div>
  );
}

/** One tile: the gradient itself, or the code icon when there is no CSS. */
function GradientTile({ css, label, selected, onClick }: {
  css?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-1 rounded border-2",
        selected
          ? "border-indigo-500"
          : "border-transparent hover:border-zinc-600",
      )}
    >
      {css === undefined
        ? (
          <div className="h-12 rounded bg-zinc-800 flex items-center justify-center">
            <i className="fa-solid fa-code text-zinc-500" />
          </div>
        )
        : <div className="h-12 rounded" style={{ background: css }} />}
      <div
        className={cn(
          "text-xs text-zinc-400 mt-1",
          css !== undefined && "truncate",
        )}
      >
        {label}
      </div>
    </button>
  );
}
