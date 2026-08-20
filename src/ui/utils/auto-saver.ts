/**
 * Debounced auto-saver with retry.
 *
 * Pure scheduling state machine — no store or React dependencies — so the
 * debounce/retry behaviour is unit-testable with fake timers.
 *
 * - `schedule(value)` debounces rapid calls; only the latest value is saved.
 * - A failed save keeps the value parked and retries with capped backoff
 *   indefinitely; the first failure of a streak is flagged so the caller
 *   can notify once instead of on every retry.
 * - `flush()` saves any pending value immediately and rejects on failure,
 *   leaving the retry schedule in place.
 */

export const SAVE_DEBOUNCE_MS = 50;
export const RETRY_DELAYS_MS = [1000, 2000, 4000];

export interface AutoSaverEvents {
  /** All pending work is saved — the state is clean. */
  onSaved: () => void;
  /** A save attempt failed; `firstFailure` is true at the start of a streak. */
  onSaveError: (error: unknown, firstFailure: boolean) => void;
  /** A save succeeded after one or more failures. */
  onRecovered: () => void;
}

export interface AutoSaver<T> {
  schedule: (value: T) => void;
  flush: () => Promise<void>;
  dispose: () => void;
}

export function createAutoSaver<T>(
  save: (value: T) => Promise<void>,
  events: AutoSaverEvents,
): AutoSaver<T> {
  let pending: T | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inFlight: Promise<boolean> | null = null;
  let failures = 0;
  let lastError: unknown = null;

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function armTimer(delayMs: number) {
    clearTimer();
    timer = setTimeout(() => {
      timer = null;
      void attempt();
    }, delayMs);
  }

  /** Save the latest pending value; resolves true on success, never rejects. */
  function attempt(): Promise<boolean> {
    if (inFlight) return inFlight;
    if (pending === null) return Promise.resolve(true);
    const value = pending;
    pending = null;
    inFlight = save(value).then(
      () => {
        inFlight = null;
        lastError = null;
        if (failures > 0) {
          failures = 0;
          events.onRecovered();
        }
        if (pending === null) {
          events.onSaved();
        } else {
          // an edit arrived while saving — keep draining
          armTimer(SAVE_DEBOUNCE_MS);
        }
        return true;
      },
      (error) => {
        inFlight = null;
        lastError = error;
        // keep the failed value parked unless a newer edit replaced it
        if (pending === null) pending = value;
        failures++;
        events.onSaveError(error, failures === 1);
        armTimer(
          RETRY_DELAYS_MS[Math.min(failures, RETRY_DELAYS_MS.length) - 1],
        );
        return false;
      },
    );
    return inFlight;
  }

  return {
    schedule(value) {
      pending = value;
      // A pending retry or in-flight save picks up the newer value on its
      // own; only arm the debounce from idle so edits don't reset backoff.
      if (timer === null && inFlight === null) armTimer(SAVE_DEBOUNCE_MS);
    },
    async flush() {
      if (inFlight) await inFlight;
      clearTimer();
      if (!(await attempt())) throw lastError;
    },
    dispose() {
      clearTimer();
    },
  };
}
