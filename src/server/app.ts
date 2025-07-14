import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { webhookHandler } from "./routes/webhook";
import { accountHistoryHandler } from "./routes/account-history";
import { newMetersHandler } from "./routes/new-meters";
import { ratesHandler } from "./routes/rates";
import { readingDetailsHandler } from "./routes/reading-details";
import { waterConcernsHandler } from "./routes/water-concerns";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [
    healthcheckHandler,
    accountHistoryHandler,
    newMetersHandler,
    ratesHandler,
    readingDetailsHandler,
    waterConcernsHandler,
    webhookHandler,
  ] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
