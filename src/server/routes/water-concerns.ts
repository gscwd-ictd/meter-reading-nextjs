import { WaterConcernRepository } from "@/lib/repositories/WaterConcernRepository";
import { WaterConcernService } from "@/lib/services/WaterConcernService";
import { CreateWaterConcernSchema, UpdateWaterConcernSchema } from "@/lib/validators/water-concerns-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const waterConcernRepository = new WaterConcernRepository();
const waterConcernService = new WaterConcernService(waterConcernRepository);

export const waterConcernsHandler = new Hono()
  .basePath("water-concerns")
  .get("/", async (c) => {
    return c.json(await waterConcernService.getAll());
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await waterConcernService.getById(id));
  })
  .post("/", zValidator("json", CreateWaterConcernSchema), async (c) => {
    const body = c.req.valid("json");
    return c.json(await waterConcernService.create(body));
  })
  .patch("/:id", zValidator("json", UpdateWaterConcernSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    return c.json(await waterConcernService.update(id, body));
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await waterConcernService.delete(id));
  });
