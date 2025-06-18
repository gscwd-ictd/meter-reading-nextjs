import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { authHandler } from "./routes/auth";
import { tokensHandler } from "./routes/tokens";
import { accountHistoryHandler } from "./routes/accountHistory";
import { leakageHandler } from "./routes/leakage";
import { newMeterHandler } from "./routes/newMeter";
import { ratesHandler } from "./routes/rates";
import { usageHandler } from "./routes/usage";
import { waterConcernsHandler } from "./routes/waterConcerns";
import { zoneBookAddressHandler } from "./routes/zoneBookAddress";
import { webhookHandler } from "./routes/webhook";
import { readingDetailsHandler } from "./routes/readingDetails";
import { meterReaderHandler } from "./routes/meter-readers";
import { cors } from "hono/cors";
import env from "@/lib/env";
import { zoneBookHandler } from "./routes/zone-book";
import { areaHandler } from "./routes/area";

function createApp() {
  const app = new Hono().basePath("/api");

  const routes = [
    healthcheckHandler,
    authHandler,
    tokensHandler,
    readingDetailsHandler,
    accountHistoryHandler,
    leakageHandler,
    newMeterHandler,
    ratesHandler,
    usageHandler,
    waterConcernsHandler,
    zoneBookAddressHandler,
    webhookHandler,
    meterReaderHandler,
    zoneBookHandler,
    areaHandler,
  ] as const;

  app.use(
    cors({
      origin: [env.APP_HOST, "http://172.20.10.57:3000", "http://172.20.10.63:3000"],
      allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 600,
      credentials: true,
    }),
  );

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
