/**
 * SegmentedControl — a pill-style toggle between a few options, the selected
 * one marked by an indicator that slides between segments.
 *
 * The one implementation: the editors use the neutral tone, the top bar's
 * platform toggle the indigo `accent` tone in the compact size (#70).
 */

import { cn } from "@ui/utils/cn.ts";

interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
  icon?: string;
}

const TONE = {
  neutral: {
    indicator: "bg-zinc-700",
    on: "text-zinc-100",
    off: "text-zinc-500 hover:text-zinc-300",
  },
  accent: {
    indicator: "bg-indigo-600 shadow-sm",
    on: "text-white",
    off: "text-zinc-400 hover:text-zinc-200",
  },
};

/** Track padding in px; `sm` puts a 12px-text control at exactly 32px tall. */
const SIZE = { md: { track: "p-1", pad: 4 }, sm: { track: "p-0.5", pad: 2 } };
/** `gap-1` between segments. */
const GAP_PX = 4;

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  tone?: keyof typeof TONE;
  size?: keyof typeof SIZE;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
  tone = "neutral",
  size = "md",
}: SegmentedControlProps<T>) {
  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const { pad } = SIZE[size];
  const count = options.length;

  return (
    <div>
      {label && (
        <label className="text-xs text-zinc-500 block mb-1.5">{label}</label>
      )}
      <div
        className={cn(
          "relative grid gap-1 bg-zinc-800 rounded-lg",
          SIZE[size].track,
        )}
        style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
      >
        {
          /* Equal 1fr columns, so the indicator is one column wide and moves
            by its own width plus a gap per index */
        }
        {selectedIndex !== -1 && (
          <div
            aria-hidden
            className={cn(
              "absolute rounded-md transition-transform duration-200 ease-out",
              TONE[tone].indicator,
            )}
            style={{
              top: pad,
              bottom: pad,
              left: pad,
              width: `calc((100% - ${
                2 * pad + (count - 1) * GAP_PX
              }px) / ${count})`,
              transform:
                `translateX(calc(${selectedIndex} * (100% + ${GAP_PX}px)))`,
            }}
          />
        )}
        {options.map((opt) => (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200",
              value === opt.value ? TONE[tone].on : TONE[tone].off,
            )}
          >
            {opt.icon && <i className={`${opt.icon} text-[10px]`} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
