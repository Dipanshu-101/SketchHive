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
  app.use(cors());

  // Lightweight liveness probe.
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(authRoutes);
  app.use(roomRoutes);

  return app;
}
