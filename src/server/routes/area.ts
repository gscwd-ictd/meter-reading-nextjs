import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { CreateArea, CreateAreaSchema, UpdateArea, UpdateAreaSchema } from "../types/area.type";

const areaService = meterReadingContext.getAreaService();

const areaRoutes = new Hono()

  .post("/", zValidator("json", CreateAreaSchema), async (c) => {
    const body: CreateArea = c.req.valid("json");
    const result = await areaService.addArea(body);
    return c.json(result, 201);
  })

  .get("/", async (c) => {
    const result = await areaService.getArea();
    return c.json(result);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await areaService.getAreaById(id);
    return c.json(result);
  })

  .put(":id", zValidator("json", UpdateAreaSchema), async (c) => {
    const id = c.req.param("id");
    const body: UpdateArea = c.req.valid("json");
    const result = await areaService.updateAreaById(id, body);
    return c.json(result);
  })

  .delete(":id", async (c) => {
    const id = c.req.param("id");
    const result = await areaService.deleteAreaById(id);
    return c.json(result);
  });

// Export a handler with prefix /area
export const areaHandler = new Hono().route("/area", areaRoutes);
