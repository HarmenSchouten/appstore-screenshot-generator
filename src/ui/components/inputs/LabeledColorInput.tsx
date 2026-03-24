/**
 * LabeledColorInput Component
 *
 * Simple color/gradient input with label and preview swatch.
 * Supports any CSS color value (including rgba, gradients).
 */

interface LabeledColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LabeledColorInput({
  label,
  value,
  onChange,
  placeholder = "rgba(255,255,255,0.15)",
}: LabeledColorInputProps) {
  return (
    <div>
      <label className="text-xs text-zinc-500 block mb-1">{label}</label>
      <div className="flex gap-2">
        <div
          className="w-9 h-9 rounded border border-zinc-700 flex-shrink-0"
          style={{ background: value || placeholder }}
        />
        <input
          type="text"
          value={value || ""}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)}
          className="flex-1 px-3 py-2 rounded text-sm font-mono"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
