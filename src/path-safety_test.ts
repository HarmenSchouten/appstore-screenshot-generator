import { assertEquals } from "@std/assert";
import { join, resolve } from "@std/path";
import { resolveInside } from "./path-safety.ts";

const BASE = resolve("projects");

Deno.test("resolveInside: accepts plain and nested relative paths", () => {
  assertEquals(resolveInside(BASE, "foo.png"), join(BASE, "foo.png"));
  assertEquals(
    resolveInside(BASE, "sub/dir/foo.png"),
    join(BASE, "sub", "dir", "foo.png"),
  );
  // Internal ".." is fine as long as the result stays inside the base
  assertEquals(
    resolveInside(BASE, "sub/../foo.png"),
    join(BASE, "foo.png"),
  );
});

Deno.test("resolveInside: rejects traversal via ..", () => {
  assertEquals(resolveInside(BASE, ".."), null);
  assertEquals(resolveInside(BASE, "../secret.txt"), null);
  assertEquals(resolveInside(BASE, "a/../../secret.txt"), null);
  assertEquals(resolveInside(BASE, "../../../../etc/passwd"), null);
});

Deno.test("resolveInside: rejects percent-encoded traversal", () => {
  assertEquals(resolveInside(BASE, "%2e%2e/config.json"), null);
  assertEquals(resolveInside(BASE, "..%2Fsecret.txt"), null);
  assertEquals(resolveInside(BASE, "%2e%2e%2f%2e%2e%2fdeno.json"), null);
  assertEquals(resolveInside(BASE, "..%5C..%5Csecret.txt"), null);
  // Malformed percent-encoding is rejected, not passed through
  assertEquals(resolveInside(BASE, "%zz"), null);
});

Deno.test("resolveInside: rejects absolute paths on both conventions", () => {
  assertEquals(resolveInside(BASE, "/etc/passwd"), null);
  assertEquals(resolveInside(BASE, "C:\\Windows\\system32"), null);
  assertEquals(resolveInside(BASE, "C:/Windows/system32"), null);
  assertEquals(resolveInside(BASE, "\\\\server\\share"), null);
});

Deno.test("resolveInside: rejects backslash traversal on every OS", () => {
  assertEquals(resolveInside(BASE, "..\\..\\secret.txt"), null);
  assertEquals(resolveInside(BASE, "a\\..\\..\\secret.txt"), null);
});

Deno.test("resolveInside: rejects inputs resolving to the base itself", () => {
  assertEquals(resolveInside(BASE, ""), null);
  assertEquals(resolveInside(BASE, "."), null);
  assertEquals(resolveInside(BASE, "a/.."), null);
});

Deno.test("resolveInside: does not accept sibling-prefix escapes", () => {
  // "projects-evil" starts with "projects" but is not inside it
  assertEquals(resolveInside(BASE, "../projects-evil/x"), null);
});
