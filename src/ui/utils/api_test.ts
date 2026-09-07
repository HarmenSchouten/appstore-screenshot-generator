import { assertEquals, assertRejects } from "@std/assert";
import { stub } from "@std/testing/mock";
import { ApiError, createProject, generateStream, saveConfig } from "./api.ts";
import type { ProjectConfig } from "@ui/types.ts";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sseResponse(events: unknown[]): Response {
  const body = events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("");
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
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

Deno.test("generateStream forwards progress events and resolves at the end", async () => {
  using _fetch = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(sseResponse([
        { type: "start", total: 1 },
        { type: "progress", current: 1, total: 1, item: "en/ios: Hero" },
        { type: "complete", results: [], outputDir: "/out" },
      ])),
  );
  const seen: string[] = [];
  await generateStream((event) => {
    seen.push(event.type);
  });
  assertEquals(seen, ["start", "progress", "complete"]);
});

Deno.test("generateStream rejects with the server's message on an error event", async () => {
  using _fetch = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(sseResponse([
        { type: "start", total: 2 },
        { type: "error", message: "Chrome or Chromium was not found." },
      ])),
  );
  const seen: string[] = [];
  await assertRejects(
    () =>
      generateStream((event) => {
        seen.push(event.type);
      }),
    Error,
    "Chrome or Chromium was not found.",
  );
  assertEquals(seen, ["start"]);
});

Deno.test("generateStream hands the abort signal to fetch", async () => {
  const controller = new AbortController();
  let receivedSignal: AbortSignal | null | undefined;
  using _fetch = stub(globalThis, "fetch", (_input, init) => {
    receivedSignal = init?.signal;
    return Promise.resolve(sseResponse([]));
  });
  await generateStream(() => {}, controller.signal);
  assertEquals(receivedSignal, controller.signal);
});
