import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

/**
 * Authenticated request — every route mounted behind `authMiddleware` can rely
 * on `req.userId` being a verified, non-empty string. Kept as a typed extension
 * instead of `(req as any).userId` so downstream handlers stay type-safe.
 */
export interface AuthenticatedRequest extends Request {
  userId: string;
}

/**
 * Extracts the raw JWT from the Authorization header.
 *
 * Accepts BOTH shapes so we never break the existing frontend contract while
 * also supporting the standard scheme:
 *   - `Authorization: <token>`          (the app's current convention)
 *   - `Authorization: Bearer <token>`   (standard)
 *
 * Returns null when the header is missing or empty.
 */
function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || typeof header !== "string") return null;

  const trimmed = header.trim();
  if (!trimmed) return null;

  // Case-insensitive "Bearer " prefix, otherwise treat the whole value as the token.
  const match = /^Bearer\s+(.+)$/i.exec(trimmed);
  return match ? match[1]!.trim() : trimmed;
}

/**
 * JWT authentication middleware — the single, reusable gate for every
 * room-related (and any other protected) route.
 *
 * Contract:
 *   - Missing/malformed/expired/invalid token  → 401 Unauthorized (never trusts
 *     the client; verification happens here, server-side).
 *   - Valid token                              → attaches `userId` and continues.
 *
 * `jwt.verify` throws on a bad/expired signature, so it MUST be wrapped — the
 * previous implementation let that throw crash the request. We normalize every
 * failure to a clean 401.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ message: "Unauthorized: missing token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // A string payload means the token wasn't signed with an object claim set.
    if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      res.status(401).json({ message: "Unauthorized: invalid token" });
      return;
    }

    const userId = (decoded as jwt.JwtPayload).userId;
    if (typeof userId !== "string" || !userId) {
      res.status(401).json({ message: "Unauthorized: invalid token" });
      return;
    }

    (req as AuthenticatedRequest).userId = userId;
    next();
  } catch {
    // Covers TokenExpiredError, JsonWebTokenError, NotBeforeError, etc.
    res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
}
