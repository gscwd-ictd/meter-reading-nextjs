import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { webhookHandler } from "./routes/webhook";
import { accountHistoryHandler } from "./routes/account-history";
import { newMetersHandler } from "./routes/new-meters";
import { ratesHandler } from "./routes/rates";
import { readingDetailsHandler } from "./routes/reading-details";
import { waterConcernsHandler } from "./routes/water-concerns";
<<<<<<< HEAD
=======
import { zoneBookHandler } from "./routes/zone-book";
import { areaHandler } from "./routes/area";
import { consumerHandler } from "./routes/consumer";
import { authHandler } from "./routes/auth";
import { leakageHandler } from "./routes/leakages";
import { tokensHandler } from "./routes/tokens";
import { cors } from "hono/cors";
import { meterReaderHandler } from "./routes/meter-readers";
import { scheduleHandler } from "./routes/schedule";
>>>>>>> main

function createApp() {
  const app = new Hono().basePath("/api");

  app.use(
    "*",
    cors({
      origin: [
        "http://localhost:3000",
        "http://172.20.10.57:3000",
        "http://172.20.10.53:3000",
        "http://172.20.10.63:3000",
      ],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization"],
      maxAge: 600,
      credentials: true,
    }),
  );

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
<<<<<<< HEAD
=======
    zoneBookHandler,
    areaHandler,
    meterReaderHandler,
    scheduleHandler,
    consumerHandler,
    tokensHandler,
>>>>>>> main
  ] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
