import { Hono } from "hono";
import db from "../db/connection";
import { UpdateUsageSchema, usage, UsageSchema } from "../db/schemas/meterReading";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

export const usageHandler = new Hono()
  .basePath("usage")
  .get("/", async (c) => {
    const res = await db.select().from(usage);
    return c.json(res);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(usage).where(eq(usage.id, id));
    return c.json(res[0]);
  })

  .post("/", zValidator("json", UsageSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(usage).values(body).returning();
    return c.json(res[0]);
  })

  .patch("/:id", zValidator("json", UpdateUsageSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.update(usage).set(body).where(eq(usage.id, id)).returning();
    return c.json(res[0]);
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(usage).where(eq(usage.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
