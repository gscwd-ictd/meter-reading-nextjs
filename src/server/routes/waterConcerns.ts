import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { UpdateWaterConcernsSchema, waterConcerns, WaterConcernsSchema } from "../db/schemas/meterReading";
import db from "../db/connection";
import { eq } from "drizzle-orm";

export const waterConcernsHandler = new Hono()
  .basePath("water-concerns")
  .get("/", async (c) => {
    const res = await db.select().from(waterConcerns);
    return c.json(res);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(waterConcerns).where(eq(waterConcerns.id, id));
    return c.json(res[0]);
  })
  .post("/", zValidator("json", WaterConcernsSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(waterConcerns).values(body).returning();
    return c.json(res[0]);
  })
  .patch("/:id", zValidator("json", UpdateWaterConcernsSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.update(waterConcerns).set(body).where(eq(waterConcerns.id, id)).returning();
    return c.json(res[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(waterConcerns).where(eq(waterConcerns.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
