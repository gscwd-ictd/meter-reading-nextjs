import { Hono } from "hono";
import db from "../db/connection";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { readingDetails, ReadingDetailsSchema, UpdateReadingDetailsSchema } from "../db/schemas/meterReading";

export const readingDetailsHandler = new Hono()
  .basePath("reading-details")
  .get("/", async (c) => {
    const res = await db.select().from(readingDetails);
    return c.json(res);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(readingDetails).where(eq(readingDetails.id, id));
    return c.json(res[0]);
  })
  .post("/", zValidator("json", ReadingDetailsSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(readingDetails).values(body).returning();
    return c.json(res[0]);
  })
  .patch("/:id", zValidator("json", UpdateReadingDetailsSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.update(readingDetails).set(body).where(eq(readingDetails.id, id)).returning();
    return c.json(res[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(readingDetails).where(eq(readingDetails.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
