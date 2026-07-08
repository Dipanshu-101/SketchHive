/**
 * Express app assembly. Wires global middleware and mounts the feature route
 * modules. Kept separate from `index.ts` (which only starts the server) so the
 * app can be imported for testing without binding a port.
 */
import express, { type Express } from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import { roomRoutes } from "./routes/room.routes";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  // CORS: in production restrict to the deployed frontend origin(s) via
  // FRONTEND_URL (comma-separated for multiple). When unset (local development)
  // allow all origins so the app works with zero configuration. Authorization is
  // sent as a header (not a cookie), so credentialed CORS isn't required.
  const frontendUrl = process.env.FRONTEND_URL;
  app.use(
    cors(
      frontendUrl
        ? { origin: frontendUrl.split(",").map((o) => o.trim()) }
        : undefined,
    ),
  );

  // Lightweight liveness probe.
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(authRoutes);
  app.use(roomRoutes);

  return app;
}
