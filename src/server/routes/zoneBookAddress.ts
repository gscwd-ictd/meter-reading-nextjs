import { Hono } from "hono";
import db from "../db/connection";
import {
  UpdateZoneBookAddressSchema,
  zoneBookAddress,
  ZoneBookAddressSchema,
} from "../db/schemas/meterReading";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

export const zoneBookAddressHandler = new Hono()
  .basePath("/zonebook-address")
  .get("/", async (c) => {
    const res = await db.select().from(zoneBookAddress);
    return c.json(res);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const res = await db.select().from(zoneBookAddress).where(eq(zoneBookAddress.id, id));
    return c.json(res[0]);
  })

  .post("/", zValidator("json", ZoneBookAddressSchema), async (c) => {
    const body = c.req.valid("json");
    const res = await db.insert(zoneBookAddress).values(body).returning();
    return c.json(res[0]);
  })

  .patch("/:id", zValidator("json", UpdateZoneBookAddressSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const res = await db.update(zoneBookAddress).set(body).where(eq(zoneBookAddress.id, id)).returning();
    return c.json(res[0]);
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(zoneBookAddress).where(eq(zoneBookAddress.id, id));
    return c.json({ method: "delete", status: "successful" });
  });
