import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import db from "../db/connections";
import { eq } from "drizzle-orm";
import { leakages } from "../db/schemas/leakages";
import { CreateLeakageSchema, UpdateLeakageSchema } from "@mr/lib/validators/leakage-schema";

export const leakageHandler = new Hono()
  .basePath("leakage")
  .get("/", async (c) => {
    const res = await db.pgConn.select().from(leakages);
    return c.json(res);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.pgConn.select().from(leakages).where(eq(leakages.id, id));
    return c.json(res[0]);
  })
  .post("/", zValidator("json", CreateLeakageSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.pgConn.insert(leakages).values(body).returning();
    return c.json(res[0]);
  })
  .patch("/:id", zValidator("json", UpdateLeakageSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.pgConn.update(leakages).set(body).where(eq(leakages.id, id)).returning();
    return c.json(res[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.pgConn.delete(leakages).where(eq(leakages.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
