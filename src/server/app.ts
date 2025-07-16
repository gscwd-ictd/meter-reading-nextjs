import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { meterReaderHandler } from "./routes/meter-readers";
import { cors } from "hono/cors";
import env from "@/lib/env";
import { zoneBookHandler } from "./routes/zone-book";
import { areaHandler } from "./routes/area";
import { scheduleHandler } from "./routes/schedule";
import { consumerHandler } from "./routes/consumer";

function createApp() {
  const app = new Hono().basePath("/api");

  app.use(
    cors({
      origin: [env.APP_HOST, "http://172.20.10.57:3000", "http://172.20.10.63:3000"],
      allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 600,
      credentials: true,
    }),
  );

  const routes = [
    healthcheckHandler,
    meterReaderHandler,
    zoneBookHandler,
    areaHandler,
    scheduleHandler,
    consumerHandler,
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
