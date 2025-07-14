import { NewMeterRepository } from "@/lib/repositories/NewMeterRepository";
import { NewMeterService } from "@/lib/services/NewMeterService";
import { CreateNewMeterSchema, UpdateNewMeterSchema } from "@/lib/validators/new-meter-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const newMeterRepository = new NewMeterRepository();
const newMeterService = new NewMeterService(newMeterRepository);

export const newMetersHandler = new Hono()
  .basePath("new-meters")
  .get("/", async (c) => {
    return c.json(await newMeterService.getAll());
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await newMeterService.getById(id));
  })
  .post("/", zValidator("json", CreateNewMeterSchema), async (c) => {
    const body = c.req.valid("json");
    return c.json(await newMeterService.create(body));
  })
  .patch("/:id", zValidator("json", UpdateNewMeterSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    return c.json(await newMeterService.update(id, body));
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await newMeterService.delete(id));
  });
