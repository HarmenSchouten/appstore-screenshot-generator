/**
 * Shared test helpers
 *
 * Only imported from *_test.ts files — never from production code.
 */

import { Hono } from "hono";
import type { Screenshot, ShapeLayerProps } from "@app-types";
import { SHAPE_META, SHAPE_TYPES } from "@lib";
import { notFound, onError } from "@routes/http.ts";

/**
 * Run `fn` with the projects module pointed at a fresh temp directory
 * (via the PROJECTS_DIR env override in projects.ts), restoring the
 * previous value and removing the directory afterwards.
 */
export async function withTempProjectsDir(
  fn: (dir: string) => Promise<void>,
): Promise<void> {
  const dir = await Deno.makeTempDir({ prefix: "appstore-screenshots-test-" });
  const previous = Deno.env.get("PROJECTS_DIR");
  Deno.env.set("PROJECTS_DIR", dir);
  try {
    await fn(dir);
  } finally {
    if (previous === undefined) {
      Deno.env.delete("PROJECTS_DIR");
    } else {
      Deno.env.set("PROJECTS_DIR", previous);
    }
    await Deno.remove(dir, { recursive: true });
  }
}

/**
 * A Hono app carrying the production error and 404 handlers, so route tests
 * see the same `{ error }` JSON the client does.
 */
export function makeRouteApp(): Hono {
  const app = new Hono();
  app.onError(onError);
  app.notFound(notFound);
  return app;
}

/** Send a JSON body the way the frontend's api.ts does. */
export function jsonRequest(
  app: Hono,
  method: string,
  path: string,
  body: unknown,
): Promise<Response> {
  return Promise.resolve(app.request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
}

/** A representative store screenshot: background + headline + phone frame. */
export function makeDefaultScreenshot(): Screenshot {
  return {
    id: "shot-1",
    name: "Hero",
    role: "screenshot",
    layers: [
      { id: "bg", type: "background", opacity: 1 },
      {
        id: "headline",
        type: "text",
        text: "Track your day",
        posX: 50,
        posY: 12,
        rotation: 0,
        opacity: 1,
        fontSize: 48,
        fontWeight: 700,
        textAlign: "center",
      },
      {
        id: "phone",
        type: "phone-frame",
        model: "ios-iphone-15-pro",
        imagePath: "images/screen.png",
        scale: 70,
        posX: 50,
        posY: 65,
        rotation: 0,
        opacity: 1,
      },
    ],
  };
}

/** A representative Play feature graphic with a phone frame. */
export function makeFeatureGraphic(): Screenshot {
  return {
    id: "fg-1",
    name: "Feature graphic",
    role: "feature-graphic",
    layers: [
      { id: "bg", type: "background", opacity: 1 },
      {
        id: "headline",
        type: "text",
        text: "Plan. Track. Done.",
        posX: 32,
        posY: 50,
        rotation: 0,
        opacity: 1,
        fontSize: 56,
        fontWeight: 800,
        textAlign: "left",
      },
      {
        id: "phone",
        type: "phone-frame",
        model: "android-pixel-9-pro",
        imagePath: "images/screen.png",
        scale: 24,
        posX: 78,
        posY: 55,
        rotation: 0,
        opacity: 1,
      },
    ],
  };
}

/** Exercises the remaining layer renderers: shape, glow, and image. */
export function makeEffectsScreenshot(): Screenshot {
  return {
    id: "shot-effects",
    name: "Effects",
    role: "screenshot",
    layers: [
      { id: "bg", type: "background", opacity: 1 },
      {
        id: "glow",
        type: "glow",
        color: "#a855f7",
        size: 400,
        blur: 80,
        posX: 50,
        posY: 40,
        rotation: 0,
        opacity: 0.6,
      },
      {
        id: "star",
        type: "shape",
        shapeType: "star",
        size: 120,
        color: "#fbbf24",
        filled: true,
        points: 5,
        posX: 80,
        posY: 20,
        rotation: 15,
        opacity: 1,
      },
      {
        id: "blob",
        type: "shape",
        shapeType: "blob",
        size: 300,
        color: "#6366f1",
        filled: true,
        complexity: 6,
        seed: 42,
        posX: 20,
        posY: 75,
        rotation: 0,
        opacity: 0.8,
      },
      {
        id: "logo",
        type: "image",
        imagePath: "images/logo.png",
        size: 30,
        borderRadius: 24,
        posX: 50,
        posY: 90,
        rotation: 0,
        opacity: 1,
      },
    ],
  };
}

/**
 * Every shape type at its defaults, plus a filled variant of each shape
 * that has the toggle — one layer per ShapeLayer branch.
 */
export function makeAllShapesScreenshot(): Screenshot {
  const shape = (
    shapeType: ShapeLayerProps["shapeType"],
    i: number,
    filled: boolean,
  ): ShapeLayerProps => ({
    id: `${shapeType}${filled ? "-filled" : ""}`,
    type: "shape",
    shapeType,
    size: 120,
    color: "#fbbf24",
    filled,
    posX: 10 + (i % 5) * 20,
    posY: 10 + Math.floor(i / 5) * 12,
    rotation: 0,
    opacity: 1,
  });
  const outlined = SHAPE_TYPES.map((t, i) => shape(t, i, false));
  const filled = SHAPE_TYPES.filter((t) => SHAPE_META[t].paint === "toggle")
    .map((t, i) => shape(t, i + outlined.length, true));
  return {
    id: "shot-shapes",
    name: "All shapes",
    role: "screenshot",
    layers: [
      { id: "bg", type: "background", opacity: 1 },
      ...outlined,
      ...filled,
    ],
  };
}
