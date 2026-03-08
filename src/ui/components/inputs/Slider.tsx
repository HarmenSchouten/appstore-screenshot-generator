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
  unit = '',
  showValue = true,
}: SliderProps) {
  const displayValue =
    typeof value === 'number'
      ? Number.isInteger(value)
        ? value
        : value.toFixed(step < 1 ? 2 : 0)
      : value;

  return (
    <div>
      <div class="flex justify-between items-center mb-1">
        <label class="text-xs text-zinc-500">{label}</label>
        {showValue && (
          <span class="text-xs text-zinc-400">
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
        class="w-full"
      />
    </div>
  );
}
