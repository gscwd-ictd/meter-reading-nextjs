import { Hono } from "hono";
import { healthcheckHandler } from "./routes/healthcheck";
import { personnelHandler } from "./routes/personnel";
import { cors } from "hono/cors";
import env from "@/lib/env";

function createApp() {
  const app = new Hono().basePath("/api");

  app.use(
    cors({
      origin: [env.APP_HOST],
      allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 600,
      credentials: true,
    }),
  );

  const routes = [healthcheckHandler, personnelHandler] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
