import { Hono } from "hono";
import db from "../db/connection";
import { newMeter, NewMeterSchema, UpdateNewMeterSchema } from "../db/schemas/meterReading";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

export const newMeterHandler = new Hono()
  .basePath("new-meter")
  .get("/", async (c) => {
    const res = await db.select().from(newMeter);
    return c.json(res);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(newMeter).where(eq(newMeter.id, id));
    return c.json(res[0]);
  })
  .post("/", zValidator("json", NewMeterSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(newMeter).values(body).returning();
    return c.json(res[0]);
  })
  .patch("/:id", zValidator("json", UpdateNewMeterSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.update(newMeter).set(body).where(eq(newMeter.id, id)).returning();
    return c.json(res[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(newMeter).where(eq(newMeter.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
