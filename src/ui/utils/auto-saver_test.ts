import { assertEquals, assertRejects } from "@std/assert";
import { FakeTime } from "@std/testing/time";
import {
  createAutoSaver,
  RETRY_DELAYS_MS,
  SAVE_DEBOUNCE_MS,
} from "./auto-saver.ts";

function makeHarness() {
  const calls: string[] = [];
  const events = { saved: 0, errors: [] as boolean[], recovered: 0 };
  let failure: Error | null = null;
  const saver = createAutoSaver<string>(
    (value) => {
      calls.push(value);
      return failure ? Promise.reject(failure) : Promise.resolve();
    },
    {
      onSaved: () => events.saved++,
      onSaveError: (_err, firstFailure) => events.errors.push(firstFailure),
      onRecovered: () => events.recovered++,
    },
  );
  return {
    saver,
    calls,
    events,
    fail: (err: Error | null) => {
      failure = err;
    },
  };
}

Deno.test("debounces rapid edits into one save of the latest value", async () => {
  using time = new FakeTime();
  const h = makeHarness();
  h.saver.schedule("a");
  h.saver.schedule("b");
  await time.tickAsync(SAVE_DEBOUNCE_MS);
  assertEquals(h.calls, ["b"]);
  assertEquals(h.events.saved, 1);
});

Deno.test("failed save retries with backoff and caps the delay", async () => {
  using time = new FakeTime();
  const h = makeHarness();
  h.fail(new Error("boom"));
  h.saver.schedule("a");
  await time.tickAsync(SAVE_DEBOUNCE_MS);
  assertEquals(h.calls.length, 1);
  assertEquals(h.events.errors, [true]);
  assertEquals(h.events.saved, 0);

  for (const delay of RETRY_DELAYS_MS) {
    const before = h.calls.length;
    await time.tickAsync(delay - 1);
    assertEquals(h.calls.length, before);
    await time.tickAsync(1);
    assertEquals(h.calls.length, before + 1);
  }
  // stays at the cap indefinitely
  await time.tickAsync(RETRY_DELAYS_MS.at(-1)!);
  assertEquals(h.calls.length, 5);
  // only the first failure of the streak is flagged
  assertEquals(h.events.errors, [true, false, false, false, false]);
  assertEquals(h.events.saved, 0);
});

Deno.test("a successful retry marks clean and reports recovery", async () => {
  using time = new FakeTime();
  const h = makeHarness();
  h.fail(new Error("boom"));
  h.saver.schedule("a");
  await time.tickAsync(SAVE_DEBOUNCE_MS);

  h.fail(null);
  await time.tickAsync(RETRY_DELAYS_MS[0]);
  assertEquals(h.calls, ["a", "a"]);
  assertEquals(h.events.saved, 1);
  assertEquals(h.events.recovered, 1);

  // next failure streak flags firstFailure again
  h.fail(new Error("boom again"));
  h.saver.schedule("b");
  await time.tickAsync(SAVE_DEBOUNCE_MS);
  assertEquals(h.events.errors, [true, true]);
});

Deno.test("an edit during retry backoff is picked up by the pending retry", async () => {
  using time = new FakeTime();
  const h = makeHarness();
  h.fail(new Error("boom"));
  h.saver.schedule("a");
  await time.tickAsync(SAVE_DEBOUNCE_MS);

  h.saver.schedule("b");
  h.fail(null);
  await time.tickAsync(RETRY_DELAYS_MS[0]);
  assertEquals(h.calls, ["a", "b"]);
  assertEquals(h.events.saved, 1);
});

Deno.test("flush saves the pending value immediately", async () => {
  using _time = new FakeTime();
  const h = makeHarness();
  h.saver.schedule("a");
  await h.saver.flush();
  assertEquals(h.calls, ["a"]);
  assertEquals(h.events.saved, 1);
});

Deno.test("flush resolves immediately when nothing is pending", async () => {
  using _time = new FakeTime();
  const h = makeHarness();
  await h.saver.flush();
  assertEquals(h.calls.length, 0);
});

Deno.test("flush rejects on failure and leaves the retry scheduled", async () => {
  using time = new FakeTime();
  const h = makeHarness();
  h.fail(new Error("boom"));
  h.saver.schedule("a");
  await assertRejects(() => h.saver.flush(), Error, "boom");
  assertEquals(h.calls, ["a"]);

  h.fail(null);
  await time.tickAsync(RETRY_DELAYS_MS[0]);
  assertEquals(h.calls, ["a", "a"]);
  assertEquals(h.events.saved, 1);
});
