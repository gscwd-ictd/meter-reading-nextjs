import { Hono } from "hono";
import db from "../db/connection";
import { accountHistory, AccountHistorySchema, UpdateAccountHistorySchema } from "../db/schemas/meterReading";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

export const accountHistoryHandler = new Hono()
  .basePath("account-history")
  .get("/", async (c) => {
    const res = await db.select().from(accountHistory);
    return c.json(res);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(accountHistory).where(eq(accountHistory.id, id));
    return c.json(res[0]);
  })

  .post("/", zValidator("json", AccountHistorySchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(accountHistory).values(body).returning();
    return c.json(res[0]);
  })

  .patch("/:id", zValidator("json", UpdateAccountHistorySchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const res = await db.update(accountHistory).set(body).where(eq(accountHistory.id, id)).returning();
    return c.json(res[0]);
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(accountHistory).where(eq(accountHistory.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
