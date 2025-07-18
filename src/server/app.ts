import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { webhookHandler } from "./routes/webhook";
import { accountHistoryHandler } from "./routes/account-history";
import { newMetersHandler } from "./routes/new-meters";
import { ratesHandler } from "./routes/rates";
import { readingDetailsHandler } from "./routes/reading-details";
import { waterConcernsHandler } from "./routes/water-concerns";
import { meterReaderHandler } from "./routes/meter-readers";
import { zoneBookHandler } from "./routes/zone-book";
import { areaHandler } from "./routes/area";
import { scheduleHandler } from "./routes/schedule";
import { consumerHandler } from "./routes/consumer";
import { authHandler } from "./routes/auth";
import { leakageHandler } from "./routes/leakages";
import { tokensHandler } from "./routes/tokens";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [
    healthcheckHandler,
    authHandler,
    leakageHandler,
    accountHistoryHandler,
    newMetersHandler,
    ratesHandler,
    readingDetailsHandler,
    waterConcernsHandler,
    webhookHandler,
    meterReaderHandler,
    zoneBookHandler,
    areaHandler,
    scheduleHandler,
    consumerHandler,
    tokensHandler,
  ] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
