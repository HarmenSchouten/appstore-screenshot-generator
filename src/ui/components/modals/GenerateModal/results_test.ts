import { assertEquals } from "@std/assert";
import type { GenerateResult } from "@ui/types.ts";
import { countItems, groupResults, resultName } from "./results.ts";

function result(
  overrides: Partial<GenerateResult> & { relativePath: string },
): GenerateResult {
  return {
    language: "en",
    platform: "android",
    role: "screenshot",
    screenshotName: "",
    status: "success",
    ...overrides,
  } as GenerateResult;
}

Deno.test("groupResults keeps languages in first-seen order and drops failures", () => {
  const grouped = groupResults([
    result({ language: "de", relativePath: "de/android/1.png" }),
    result({ language: "en", relativePath: "en/android/1.png" }),
    result({
      language: "fr",
      relativePath: "fr/android/1.png",
      status: "error",
      error: "boom",
    }),
    result({ language: "de", platform: "ios", relativePath: "de/ios/1.png" }),
  ]);
  assertEquals([...grouped.keys()], ["de", "en"]);
  assertEquals(grouped.get("de")!.android.screenshots.length, 1);
  assertEquals(grouped.get("de")!.ios.screenshots.length, 1);
  assertEquals(grouped.get("en")!.ios.screenshots.length, 0);
});

Deno.test("groupResults sets the Android feature graphic apart", () => {
  const grouped = groupResults([
    result({ relativePath: "en/android/1.png" }),
    result({ relativePath: "en/android/fg.png", role: "feature-graphic" }),
  ]);
  const en = grouped.get("en")!;
  assertEquals(en.android.feature?.relativePath, "en/android/fg.png");
  assertEquals(en.android.screenshots.map((r) => r.relativePath), [
    "en/android/1.png",
  ]);
  assertEquals(countItems(en), 2);
});

Deno.test("resultName prefers the screenshot name, then file name or role", () => {
  assertEquals(
    resultName(
      result({ relativePath: "en/android/1.png", screenshotName: "Hero" }),
    ),
    "Hero",
  );
  assertEquals(
    resultName(result({ relativePath: "en/android/2-screenshot.png" })),
    "2-screenshot.png",
  );
  assertEquals(
    resultName(
      result({ relativePath: "en/android/fg.png", role: "feature-graphic" }),
    ),
    "Feature Graphic",
  );
});
