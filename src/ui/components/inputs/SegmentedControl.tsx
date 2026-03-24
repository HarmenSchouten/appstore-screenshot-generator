/**
 * SegmentedControl Component
 *
 * A pill-style toggle for switching between options.
 * Follows the same visual language as the gradient-type selector in editors.
 */

interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
  icon?: string;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div>
      {label && (
        <label className="text-xs text-zinc-500 block mb-1.5">{label}</label>
      )}
      <div
        className="grid gap-1 bg-zinc-800 rounded-lg p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map((opt) => (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              value === opt.value
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {opt.icon && <i className={`${opt.icon} text-[10px]`} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
