/**
 * Join class names, dropping the falsy ones: `cn("card", selected && "ring")`.
 *
 * No conflict resolution (that needs tailwind-merge): keep an element's
 * alternative variants in one call so only one of them is ever truthy.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
