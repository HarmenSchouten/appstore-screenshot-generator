/**
 * Path Safety
 *
 * Confines client-supplied path segments to a base directory. Routes that
 * join user input into filesystem paths must go through `resolveInside`
 * (wired up in #62); `join()` alone does not prevent traversal.
 */

import { resolve, SEPARATOR } from "@std/path";
import { isAbsolute as isPosixAbsolute } from "@std/path/posix";
import { isAbsolute as isWindowsAbsolute } from "@std/path/windows";

/**
 * Resolve `userPath` against `base` and verify the result stays strictly
 * inside it. Returns the resolved absolute path, or `null` when the input
 * is empty, absolute, percent-decodes badly, or escapes the base.
 *
 * Backslashes are treated as separators on every OS, and absolute paths are
 * rejected under both POSIX and Windows conventions, so traversal written
 * for one platform can't slip through a server running on the other. Input
 * is percent-decoded once, catching encoded traversal (`%2e%2e`, `..%2F`)
 * that reaches a route without the framework decoding it.
 */
export function resolveInside(base: string, userPath: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(userPath);
  } catch {
    return null;
  }

  const normalized = decoded.replaceAll("\\", "/");
  if (isPosixAbsolute(normalized) || isWindowsAbsolute(normalized)) {
    return null;
  }

  const resolvedBase = resolve(base);
  const resolved = resolve(resolvedBase, normalized);

  // The base itself (empty input, ".", "a/..") is not a path *inside* it —
  // this is what turns getProjectDir("") into a rejection instead of a
  // recursive delete of the projects root.
  if (resolved === resolvedBase) return null;

  return resolved.startsWith(resolvedBase + SEPARATOR) ? resolved : null;
}
