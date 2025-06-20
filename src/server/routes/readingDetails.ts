import { Hono } from "hono";
import { readingDetails, ReadingDetailsSchema, UpdateReadingDetailsSchema } from "../db/schemas/meterReading";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import db from "../db/connection";

export const readingsDetailsHandler = new Hono()
  .basePath("reading-details")

  .get("/", async (c) => {
    const result = await db.select().from(readingDetails);
    return c.json(result);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.select().from(readingDetails).where(eq(readingDetails.id, id));
    return c.json(result[0]);
  })

  .post("/", zValidator("json", ReadingDetailsSchema), async (c) => {
    const data = c.req.valid("json");
    const result = await db
      .insert(readingDetails)
      .values({
        ...data,
        readingDate: new Date(data.readingDate),
        dueDate: new Date(data.dueDate),
        disconnectionDate: new Date(data.disconnectionDate),
      })
      .returning();
    return c.json(result[0]);
  })

  .patch("/:id", zValidator("json", UpdateReadingDetailsSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const result = await db
      .update(readingDetails)
      .set({ isPosted: data.isPosted })
      .where(eq(readingDetails.id, id))
      .returning();
    return c.json(result[0]);
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(readingDetails).where(eq(readingDetails.id, id));
    return c.json({ message: "Successfully deleted" });
  });
