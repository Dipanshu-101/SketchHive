/**
 * HTTP backend entry point — starts the server. All wiring lives in `app.ts`;
 * all logic lives in the routes/controllers/services layers.
 */
import { createApp } from "./app";
import { PORT } from "./config";

const app = createApp();

app.listen(PORT, () => {
  console.log(`HTTP backend running on port ${PORT}`);
});
