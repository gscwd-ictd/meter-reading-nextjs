import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { webhookHandler } from "./routes/webhook";
import { accountHistoryHandler } from "./routes/account-history";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [healthcheckHandler, accountHistoryHandler, webhookHandler] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
