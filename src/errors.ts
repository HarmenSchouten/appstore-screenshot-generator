/**
 * HTTP-mapped errors
 *
 * Thrown anywhere on the server — storage layer included — and rendered by
 * the root `onError` in `@routes/http.ts` as `{ error }` JSON with the
 * matching status. Keeping this module free of Hono lets `projects.ts` say
 * "not found" vs "conflict" precisely without knowing about HTTP.
 */

export type HttpErrorStatus = 400 | 404 | 409 | 415;

export class HttpError extends Error {
  constructor(readonly status: HttpErrorStatus, message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** 400 — malformed or semantically invalid client input. */
export class ValidationError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

/** 404 — the addressed resource does not exist. */
export class NotFoundError extends HttpError {
  constructor(message = "Not found") {
    super(404, message);
  }
}

/** 409 — the request conflicts with existing state (duplicate id, target exists). */
export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

/** 415 — a body was sent in a Content-Type the route does not accept. */
export class UnsupportedMediaTypeError extends HttpError {
  constructor(message: string) {
    super(415, message);
  }
}
