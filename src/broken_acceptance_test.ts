import { assertEquals } from "@std/assert";

Deno.test("harness acceptance: deliberately broken", () => {
  assertEquals(1, 2);
});
