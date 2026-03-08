/**
 * NumberInput Component
 * 
 * Number input with increment/decrement buttons.
 */

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}: NumberInputProps) {
  const decrement = () => {
    const newVal = Math.max(min, (value || 0) - step);
    onChange(newVal);
  };

  const increment = () => {
    const newVal = Math.min(max, (value || 0) + step);
    onChange(newVal);
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newVal = Number(target.value);
    if (!isNaN(newVal)) {
      onChange(Math.max(min, Math.min(max, newVal)));
    }
  };

  return (
    <div class={`flex items-stretch h-8 ${className}`}>
      <button
        type="button"
        onClick={decrement}
        class="px-2 bg-zinc-700 hover:bg-zinc-600 rounded-l text-zinc-300 hover:text-white transition-colors flex items-center justify-center"
      >
        <i class="fa-solid fa-minus text-xs" />
      </button>
      <input
        type="number"
        value={value}
        onInput={handleInput}
        min={min}
        max={max}
        step={step}
        class="w-full px-2 text-sm text-center bg-zinc-800 border-y border-zinc-700 focus:outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={increment}
        class="px-2 bg-zinc-700 hover:bg-zinc-600 rounded-r text-zinc-300 hover:text-white transition-colors flex items-center justify-center"
      >
        <i class="fa-solid fa-plus text-xs" />
      </button>
    </div>
  );
}
