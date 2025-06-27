import { Hono } from "hono";
import db from "../db/connection";
import { accounts, AccountsSchema, UpdateAccountsSchema } from "../db/schemas/meterReading";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

export const accountsHandler = new Hono()
  .basePath("accounts")
  .get("/", async (c) => {
    const res = await db.select().from(accounts);
    return c.json(res);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(accounts).where(eq(accounts.id, id));
    return c.json(res[0]);
  })
  .post("/", zValidator("json", AccountsSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(accounts).values(body).returning();
    return c.json(res[0]);
  })
  .patch("/:id", zValidator("json", UpdateAccountsSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const res = await db.update(accounts).set(body).where(eq(accounts.id, id)).returning();
    return c.json(res[0]);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(accounts).where(eq(accounts.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
