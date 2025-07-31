import { ReadingDetailsRepository } from "@mr/lib/repositories/ReadingDetailsRepository";
import { ReadingDetailsService } from "@mr/lib/services/ReadingDetailsService";
import {
  CreateReadingDetailsSchema,
  UpdateReadingDetailsSchema,
} from "@mr/lib/validators/reading-details-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const readingDetailsRepository = new ReadingDetailsRepository();
const readingDetailsService = new ReadingDetailsService(readingDetailsRepository);

export const readingDetailsHandler = new Hono()
  .basePath("/reading-details")
  .get("/", async (c) => {
    return c.json(await readingDetailsService.getAll());
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await readingDetailsService.getById(id));
  })
  .post("/", zValidator("json", CreateReadingDetailsSchema), async (c) => {
    const body = c.req.valid("json");
    return c.json(
      await readingDetailsService.create({
        ...body,
        readingDate:
          body.readingDate !== undefined && body.readingDate !== null
            ? new Date(body.readingDate).toISOString()
            : undefined,
        dueDate:
          body.dueDate !== undefined && body.dueDate !== null
            ? new Date(body.dueDate).toISOString()
            : undefined,
        disconnectionDate:
          body.disconnectionDate !== undefined && body.disconnectionDate !== null
            ? new Date(body.disconnectionDate).toISOString()
            : undefined,
        reconnectionDate:
          body.reconnectionDate !== undefined && body.reconnectionDate !== null
            ? new Date(body.reconnectionDate).toISOString()
            : undefined,
      }),
    );
  })
  .patch("/:id", zValidator("json", UpdateReadingDetailsSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    return c.json(await readingDetailsService.update(id, body));
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await readingDetailsService.delete(id));
  });
