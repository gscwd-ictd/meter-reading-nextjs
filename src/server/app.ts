import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { readingsDetailsHandler } from "./routes/readingDetails";
import { authHandler } from "./routes/auth";
import { tokensHandler } from "./routes/tokens";
import { accountHistoryHandler } from "./routes/accountHistory";
import { accountsHandler } from "./routes/accounts";
import { leakageHandler } from "./routes/leakage";
import { newMeterHandler } from "./routes/newMeter";
import { ratesHandler } from "./routes/rates";
import { usageHandler } from "./routes/usage";
import { waterConcernsHandler } from "./routes/waterConcerns";
import { zoneBookAddressHandler } from "./routes/zoneBookAddress";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [
    healthcheckHandler,
    authHandler,
    tokensHandler,
    readingsDetailsHandler,
    accountHistoryHandler,
    accountsHandler,
    leakageHandler,
    newMeterHandler,
    ratesHandler,
    usageHandler,
    waterConcernsHandler,
    zoneBookAddressHandler,
  ] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
