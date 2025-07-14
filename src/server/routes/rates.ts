import { RateRepository } from "@/lib/repositories/RateRepository";
import { RateService } from "@/lib/services/RateService";
import { CreateRateSchema, UpdateRateSchema } from "@/lib/validators/rate-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const rateRepository = new RateRepository();
const rateService = new RateService(rateRepository);

export const ratesHandler = new Hono()
  .basePath("/rates")
  .get("/", async (c) => {
    return c.json(await rateService.getAll());
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await rateService.getById(id));
  })
  .post("/", zValidator("json", CreateRateSchema), async (c) => {
    const body = c.req.valid("json");
    return c.json(await rateService.create(body));
  })
  .patch("/:id", zValidator("json", UpdateRateSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    return c.json(await rateService.update(id, body));
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await rateService.delete(id));
  });
