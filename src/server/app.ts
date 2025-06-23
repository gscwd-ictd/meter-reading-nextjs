import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { readingsDetailsHandler } from "./routes/readingDetails";
import { authHandler } from "./routes/auth";
import { tokensHandler } from "./routes/tokens";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [healthcheckHandler, authHandler, tokensHandler, readingsDetailsHandler] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
