/**
 * Slider Component
 *
 * Range slider with label and value display.
 */

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  showValue = true,
}: SliderProps) {
  // As many decimals as the step has, and no trailing zeros: a 0.01 step at
  // 0.5 reads "0.5", not "0.50", and a whole-number step never shows ".00".
  // `toFixed` also absorbs float noise from the range input.
  const decimals = (String(step).split(".")[1] ?? "").length;
  const displayValue = Number(value.toFixed(decimals));

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs text-zinc-500">{label}</label>
        {showValue && (
          <span className="text-xs text-zinc-400">
            {displayValue}
            {unit}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(e) => onChange(Number((e.target as HTMLInputElement).value))}
        className="w-full"
      />
    </div>
  );
}
