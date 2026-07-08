import type { Request, Response } from "express";
import { HttpError } from "../services/http-error";

/**
 * Wraps an async controller so thrown errors become clean HTTP responses:
 *   - `HttpError`  → its own status + message.
 *   - anything else → 500 (logged server-side; details never leaked).
 *
 * This removes the repetitive try/catch that bloated every route handler and
 * guarantees a consistent JSON error shape (`{ message }`).
 */
export function handle(
  fn: (req: Request, res: Response) => Promise<void>,
): (req: Request, res: Response) => void {
  return (req, res) => {
    fn(req, res).catch((error: unknown) => {
      if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message });
        return;
      }
      console.error("[http-backend] unhandled error:", error);
      res.status(500).json({ message: "Internal server error" });
    });
  };
}
