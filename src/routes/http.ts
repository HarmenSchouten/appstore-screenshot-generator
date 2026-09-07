/**
 * HTTP plumbing shared by every route module
 *
 * - `onError` / `notFound` are the only two places that shape an error
 *   response, so every failure — a thrown `HttpError` or an unexpected
 *   exception — reaches the client as `{ error }` JSON, never Hono's default
 *   `text/plain` 500.
 * - `readJsonBody` and the `require*` helpers parse and shape-check bodies.
 *   Insisting on `Content-Type: application/json` matters because a
 *   `text/plain` POST is a CORS-simple request any web page can fire at
 *   localhost without a preflight.
 * - `fileResponse` serves a file whose path has already passed
 *   `resolveInside`.
 */

import type { Context, ErrorHandler, NotFoundHandler } from "hono";
import { extname } from "@std/path";
import { contentType } from "@std/media-types";
import type { Platform } from "@app-types";
import { isPlatform, PLATFORMS } from "@lib";
import {
  HttpError,
  NotFoundError,
  UnsupportedMediaTypeError,
  ValidationError,
} from "@/errors.ts";

export const onError: ErrorHandler = (err, c) => {
  if (err instanceof HttpError) {
    return c.json({ error: err.message }, err.status);
  }
  // Unexpected: keep the stack for the operator, hand the client the message.
  // This is a local tool and the UI toasts the error, so hiding it helps nobody.
  console.error(err);
  return c.json({ error: err.message || "Internal server error" }, 500);
};

export const notFound: NotFoundHandler = (c) =>
  c.json({ error: "Not found" }, 404);

/**
 * Parse a JSON request body: 415 when the Content-Type isn't JSON, 400 when
 * the body isn't valid JSON.
 */
export async function readJsonBody(c: Context): Promise<unknown> {
  const type = c.req.header("content-type") ?? "";
  if (!/^application\/json\b/i.test(type.trim())) {
    throw new UnsupportedMediaTypeError(
      "Content-Type must be application/json",
    );
  }
  try {
    return await c.req.json();
  } catch {
    throw new ValidationError("Request body is not valid JSON");
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requireObject(
  value: unknown,
  what = "Request body",
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ValidationError(`${what} must be a JSON object`);
  }
  return value;
}

/** A non-blank string field, trimmed. */
export function requireString(
  obj: Record<string, unknown>,
  key: string,
): string {
  const value = obj[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`"${key}" must be a non-empty string`);
  }
  return value.trim();
}

/** Like `requireString`, but `undefined`/`null` mean "not given". */
export function optionalString(
  obj: Record<string, unknown>,
  key: string,
): string | undefined {
  if (obj[key] === undefined || obj[key] === null) return undefined;
  return requireString(obj, key);
}

export function requirePlatform(value: unknown, what = "platform"): Platform {
  if (!isPlatform(value)) {
    throw new ValidationError(
      `Unknown ${what} "${String(value)}"; expected one of: ${
        PLATFORMS.join(", ")
      }`,
    );
  }
  return value;
}

/**
 * Serve a file at a path that already passed `resolveInside`. A missing path
 * or a directory is a 404; anything else (EACCES, …) is a real error.
 */
export async function fileResponse(filePath: string): Promise<Response> {
  let info: Deno.FileInfo;
  try {
    info = await Deno.stat(filePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new NotFoundError("File not found");
    }
    throw error;
  }
  if (!info.isFile) throw new NotFoundError("File not found");

  const file = await Deno.readFile(filePath);
  return new Response(file, {
    headers: {
      "Content-Type": contentType(extname(filePath)) ??
        "application/octet-stream",
    },
  });
}
