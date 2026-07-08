/**
 * HttpError — the one error type services throw to signal a specific HTTP
 * status. Controllers catch it and translate `status`/`message` into a
 * response; anything else that escapes is treated as a 500. This keeps status
 * decisions in the domain layer without coupling services to Express.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const unauthorized = (message = "Unauthorized") =>
  new HttpError(401, message);
export const notFound = (message: string) => new HttpError(404, message);
export const conflict = (message: string) => new HttpError(409, message);
