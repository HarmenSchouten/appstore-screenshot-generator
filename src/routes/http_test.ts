import { assert, assertEquals, assertThrows } from "@std/assert";
import { NotFoundError, ValidationError } from "@/errors.ts";
import { makeRouteApp } from "@/test-helpers.ts";
import {
  readJsonBody,
  requireObject,
  requirePlatform,
  requireString,
} from "./http.ts";

Deno.test("onError: an HttpError becomes { error } JSON with its status", async () => {
  const app = makeRouteApp();
  app.get("/missing", () => {
    throw new NotFoundError("Thing not found");
  });
  app.get("/bad", () => {
    throw new ValidationError("Nope");
  });

  const missing = await app.request("/missing");
  assertEquals(missing.status, 404);
  assertEquals(await missing.json(), { error: "Thing not found" });

  const bad = await app.request("/bad");
  assertEquals(bad.status, 400);
  assertEquals(await bad.json(), { error: "Nope" });
});

Deno.test("onError: an unexpected exception is a JSON 500, not Hono's text page", async () => {
  const app = makeRouteApp();
  app.get("/boom", () => {
    throw new Error("kaboom");
  });

  // The handler logs the stack for the operator; keep the test output clean
  const originalError = console.error;
  console.error = () => {};
  try {
    const res = await app.request("/boom");
    assertEquals(res.status, 500);
    assert(res.headers.get("content-type")?.startsWith("application/json"));
    assertEquals(await res.json(), { error: "kaboom" });
  } finally {
    console.error = originalError;
  }
});

Deno.test("notFound: unmatched paths get JSON", async () => {
  const res = await makeRouteApp().request("/nothing/here");
  assertEquals(res.status, 404);
  assertEquals(await res.json(), { error: "Not found" });
});

Deno.test("readJsonBody: a non-JSON Content-Type is 415", async () => {
  const app = makeRouteApp();
  app.post("/echo", async (c) => c.json(await readJsonBody(c)));

  const plain = await app.request("/echo", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: '{"a":1}',
  });
  assertEquals(plain.status, 415);
  assertEquals(await plain.json(), {
    error: "Content-Type must be application/json",
  });

  // A string body with no explicit header defaults to text/plain — the
  // CORS-simple request any web page can send without a preflight
  const implicit = await app.request("/echo", {
    method: "POST",
    body: '{"a":1}',
  });
  assertEquals(implicit.status, 415);
});

Deno.test("readJsonBody: accepts a charset parameter, rejects malformed JSON with 400", async () => {
  const app = makeRouteApp();
  app.post("/echo", async (c) => c.json(await readJsonBody(c)));

  const ok = await app.request("/echo", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: '{"a":1}',
  });
  assertEquals(ok.status, 200);
  assertEquals(await ok.json(), { a: 1 });

  const bad = await app.request("/echo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  assertEquals(bad.status, 400);
  assertEquals(await bad.json(), { error: "Request body is not valid JSON" });
});

Deno.test("require helpers: shape errors name the offending field", () => {
  assertThrows(
    () => requireObject([]),
    ValidationError,
    "must be a JSON object",
  );
  assertThrows(
    () => requireString({ name: "   " }, "name"),
    ValidationError,
    '"name" must be a non-empty string',
  );
  assertEquals(requireString({ name: " Foo " }, "name"), "Foo");
  assertThrows(
    () => requirePlatform("banana"),
    ValidationError,
    'Unknown platform "banana"',
  );
  assertEquals(requirePlatform("ios"), "ios");
});
