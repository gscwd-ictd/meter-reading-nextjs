import { UsageRepository } from "@mr/lib/repositories/UsageRepository";
import { UsageService } from "@mr/lib/services/UsageService";
import { CreateUsageSchema, UpdateUsageSchema } from "@mr/lib/validators/usage-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const usageRepository = new UsageRepository();
const usageService = new UsageService(usageRepository);

export const usage = new Hono()
  .basePath("usage")
  .get("/", async (c) => {
    return c.json(await usageService.getAll());
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await usageService.getById(id));
  })
  .post("/", zValidator("json", CreateUsageSchema), async (c) => {
    const body = c.req.valid("json");
    return c.json(await usageService.create(body));
  })
  .patch("/:id", zValidator("json", UpdateUsageSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    return c.json(await usageService.update(id, body));
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await usageService.delete(id));
  });
