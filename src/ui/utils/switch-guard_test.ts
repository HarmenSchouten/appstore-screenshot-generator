/**
 * The two rules the guard holds apart: every successful activate has already
 * moved the server's active project, so the store follows all of them in
 * order, while only one settled switch writes the URL.
 */

import { assert } from "@std/assert";
import { createSwitchGuard } from "./switch-guard.ts";

Deno.test("one activate per project while it is in flight", () => {
  const guard = createSwitchGuard();

  assert(guard.claim("beta"), "the first effect run sends the request");
  assert(!guard.claim("beta"), "StrictMode's second run does not");

  // Settling another project leaves the claim on beta alone
  guard.settle("gamma");
  assert(!guard.claim("beta"));

  guard.settle("beta");
  assert(guard.claim("beta"), "a later link to beta asks again");
});

Deno.test("two switches in order: both land, only the newer navigates", () => {
  const guard = createSwitchGuard();
  const beta = guard.start();
  const gamma = guard.start();

  // Beta's activate already moved the server, so the store takes it — but
  // gamma is what the user asked for last, so beta must not write the URL
  assert(guard.apply(beta));
  assert(!guard.mayNavigate(beta));
  guard.settle("beta");

  assert(guard.apply(gamma));
  assert(guard.mayNavigate(gamma));
});

Deno.test("a late answer from an older switch is dropped", () => {
  const guard = createSwitchGuard();
  const beta = guard.start();
  const gamma = guard.start();

  assert(guard.apply(gamma));
  assert(guard.mayNavigate(gamma));
  guard.settle("gamma");

  // The caller stops here, so what it may do with the URL never comes up
  assert(!guard.apply(beta), "it would put the store behind the server");
});

Deno.test("a failed newer switch hands the URL to what did land", () => {
  const guard = createSwitchGuard();
  const beta = guard.start();
  const gamma = guard.start();

  assert(guard.apply(beta));
  assert(!guard.mayNavigate(beta));
  guard.settle("beta");

  // Gamma never applies — it failed — but it is the newest asked for, so it
  // is the one that puts the URL back on whatever the store now holds
  assert(guard.mayNavigate(gamma));
});

Deno.test("a superseded switch that settles last still fixes the URL", () => {
  const guard = createSwitchGuard();
  const beta = guard.start();
  const gamma = guard.start();

  // Gamma fails fast, while beta is still in flight
  assert(guard.mayNavigate(gamma));
  guard.settle("gamma");

  assert(guard.apply(beta));
  assert(
    guard.mayNavigate(beta),
    "nothing newer is left to correct the URL, so beta must",
  );
});
