/**
 * HTTP backend entry point — starts the server. All wiring lives in `app.ts`;
 * all logic lives in the routes/controllers/services layers.
 */
import { createApp } from "./app";
import { PORT } from "./config";

const app = createApp();

// Bind 0.0.0.0 so the container is reachable outside localhost (required on
// Railway and most PaaS providers). PORT comes from the environment (see config).
app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP backend running on port ${PORT}`);
});
