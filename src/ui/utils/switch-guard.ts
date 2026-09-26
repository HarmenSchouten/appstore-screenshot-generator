/**
 * Sequencing for project switches.
 *
 * Every call site is its own mutation observer, so several switches can be
 * in flight and a superseded one still runs its callbacks. Two different
 * rules apply to what it may then do:
 *
 * - A switch that loaded may hydrate the store unless a newer one already
 *   has. Applying them in order is harmless, and when the newest then fails
 *   the store holds the latest project that did load, not the one the user
 *   left two switches ago.
 * - Only one settled switch may write the URL, or a superseded one would
 *   push a path the user has already navigated away from.
 */
export function createSwitchGuard() {
  let pending: string | null = null;
  let requested = 0;
  let applied = 0;
  let outstanding = 0;

  return {
    /** False when that project is already being loaded. */
    claim(projectId: string): boolean {
      if (pending === projectId) return false;
      pending = projectId;
      return true;
    },

    /** Take a token for a switch that is starting. */
    start(): number {
      outstanding++;
      return ++requested;
    },

    /**
     * Whether this response is newer than the one the store holds — and if
     * so, that it now is the one the store holds. A late answer from an
     * older switch must not overwrite a newer one that already landed.
     */
    apply(token: number): boolean {
      if (token <= applied) return false;
      applied = token;
      return true;
    },

    /**
     * Whether this switch owns the URL: it is the newest that was asked
     * for, or the last one still running once that newest has settled.
     */
    mayNavigate(token: number): boolean {
      return token === requested || outstanding === 1;
    },

    /** Release the claim and the in-flight count once a switch has settled. */
    settle(projectId: string): void {
      if (pending === projectId) pending = null;
      outstanding = Math.max(0, outstanding - 1);
    },
  };
}

/**
 * Module state, like the auto-saver in `config-persistence.ts`: the switches
 * it sequences come from separate hooks and separate observers, and it has
 * to outlive the reconciler effect that React remounts in development.
 */
export const switchGuard = createSwitchGuard();
