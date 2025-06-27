import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { rates, RatesSchema, UpdateRatesSchema } from "../db/schemas/meterReading";
import db from "../db/connection";
import { eq } from "drizzle-orm";

export const ratesHandler = new Hono()
  .basePath("rates")
  .get("/", async (c) => {
    const res = await db.select().from(rates);
    return c.json(res);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(rates).where(eq(rates.id, id));
    return c.json(res[0]);
  })
  .post("/", zValidator("json", RatesSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(rates).values(body).returning();
    return c.json(res[0]);
  })
  .patch("/:id", zValidator("json", UpdateRatesSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.update(rates).set(body).where(eq(rates.id, id)).returning();
    return c.json(res[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(rates).where(eq(rates.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
