import { assertEquals, assertRejects } from "@std/assert";
import { stub } from "@std/testing/mock";
import { ApiError, createProject, saveConfig } from "./api.ts";
import type { ProjectConfig } from "@ui/types.ts";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.test("non-2xx rejects with ApiError carrying the server message", async () => {
  using _fetch = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(jsonResponse({ error: "disk full" }, 500)),
  );
  const err = await assertRejects(
    () => saveConfig({} as ProjectConfig),
    ApiError,
    "disk full",
  );
  assertEquals(err.status, 500);
});

Deno.test("non-JSON error body falls back to a generic message", async () => {
  using _fetch = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(new Response("Bad Gateway", { status: 502 })),
  );
  const err = await assertRejects(
    () => saveConfig({} as ProjectConfig),
    ApiError,
  );
  assertEquals(err.status, 502);
  assertEquals(err.message, "Request failed (502)");
});

Deno.test("success parses the JSON body", async () => {
  using _fetch = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(jsonResponse({ id: "p1", name: "New" }, 200)),
  );
  assertEquals(await createProject("New") as unknown, {
    id: "p1",
    name: "New",
  });
});

Deno.test("void endpoints tolerate an empty response body", async () => {
  using _fetch = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(new Response(null, { status: 204 })),
  );
  await saveConfig({} as ProjectConfig);
});
