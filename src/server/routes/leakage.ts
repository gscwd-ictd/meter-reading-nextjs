import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { leakage, LeakageSchema, UpdateLeakageSchema } from "../db/schemas/meterReading";
import db from "../db/connection";
import { eq } from "drizzle-orm";

export const leakageHandler = new Hono()
  .basePath("leakage")
  .get("/", async (c) => {
    const res = await db.select().from(leakage);
    return c.json(res);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(leakage).where(eq(leakage.id, id));
    return c.json(res[0]);
  })
  .post("/", zValidator("json", LeakageSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(leakage).values(body).returning();
    return c.json(res[0]);
  })
  .patch("/:id", zValidator("json", UpdateLeakageSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.update(leakage).set(body).where(eq(leakage.id, id)).returning();
    return c.json(res[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(leakage).where(eq(leakage.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
