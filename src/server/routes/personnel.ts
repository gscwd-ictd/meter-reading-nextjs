import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { PersonnelQuerySchema } from "../types/personnel.type";

export const personnelHandler = new Hono()
  .get("/personnels", async (c) => {
    const parsed = PersonnelQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      return c.json({ error: "Invalid query parameters" }, 400);
    }

    const { page, limit, query } = parsed.data;

    const personnels = await meterReadingContext.getPersonnelService().getAllPersonnels(page, limit, query);
    return c.json(personnels);
  })
  .get("/personnels/:id", async (c) => {
    const id = c.req.param("id");
    const personnel = await meterReadingContext.getPersonnelService().getPersonnelById(id);
    if (!personnel) return c.json({ error: "Personnel not found" }, 404);
    return c.json(personnel);
  });
