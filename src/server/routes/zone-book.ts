import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { AssignZoneBookAreaSchema } from "../types/zone-book.type";

const zoneBookService = meterReadingContext.getZoneBookService();

const zoneBookRoutes = new Hono()
  .get("/", async (c) => {
    const result = await zoneBookService.getAllZoneBooksWithArea();
    return c.json(result);
  })

  .get("/:zoneBookId", async (c) => {
    const zoneBookId = c.req.param("zoneBookId");
    const result = await zoneBookService.getZoneBookAreaById(zoneBookId);
    return c.json(result);
  })

  .post("/", zValidator("json", AssignZoneBookAreaSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await zoneBookService.assignZoneBookArea(body);
    return c.json(result, 201);
  })

  .patch("/:zoneBookId", zValidator("json", AssignZoneBookAreaSchema), async (c) => {
    const zoneBookId = c.req.param("zoneBookId");
    const body = c.req.valid("json");

    const result = await zoneBookService.updateZoneBookArea(zoneBookId, body);
    return c.json(result);
  });

export const zoneBookHandler = new Hono().route("/zone-book", zoneBookRoutes);
