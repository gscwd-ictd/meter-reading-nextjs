import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { CreateAreaSchema, UpdateAreaSchema } from "../types/area.type";

const areaService = meterReadingContext.getAreaService();

const areaRoutes = new Hono()

  .post("/", zValidator("json", CreateAreaSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await areaService.createArea(body);
    return c.json(result, 201);
  })

  .get("/", async (c) => {
    const result = await areaService.getAllAreas();
    return c.json(result);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await areaService.getAreaById(id);
    return c.json(result);
  })

  .put(":id", zValidator("json", UpdateAreaSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const result = await areaService.updateArea(id, body);
    return c.json(result);
  })

  .delete(":id", async (c) => {
    const id = c.req.param("id");
    const result = await areaService.deleteArea(id);
    return c.json(result);
  });

// Export a handler with prefix /area
export const areaHandler = new Hono().route("/area", areaRoutes);
