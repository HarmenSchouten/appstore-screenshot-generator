/**
 * Select — a native select in the app's field style, flat or grouped.
 * Group headings are styled once in `styles.css` (`select optgroup`).
 */

import { useId } from "react";
import { cn } from "@ui/utils/cn.ts";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface SelectGroup<T extends string> {
  label: string;
  options: SelectOption<T>[];
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  label?: string;
  options?: SelectOption<T>[];
  groups?: SelectGroup<T>[];
  /** A leading option with the empty value. */
  placeholder?: string;
  className?: string;
}

export function Select<T extends string>({
  value,
  onChange,
  label,
  options,
  groups,
  placeholder,
  className,
}: SelectProps<T>) {
  const id = useId();

  const select = (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn("input", className)}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options?.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      {groups?.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );

  if (!label) return select;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs text-zinc-500">
        {label}
      </label>
      {select}
    </div>
  );
}
