import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { powersyncHandler } from "./routes/powersync";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [healthcheckHandler, powersyncHandler] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
