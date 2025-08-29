import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import { CreateReadingRemarkSchema, UpdateReadingRemarkSchema } from "../types/reading-remark.type";

const readingRemarkService = meterReadingContext.getReadingRemarkService();

export const readingRemarkHandler = new Hono()
  .basePath("/reading-remarks")

  .get("/", async (c) => {
    const result = await readingRemarkService.getAllReadingRemark();
    return c.json(result);
  })

  .post("/", zValidator("json", CreateReadingRemarkSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await readingRemarkService.addReadingRemark(body);

    return c.json(result, 201);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await readingRemarkService.getReadingRemark(id);

    return c.json(result);
  })

  .patch("/:id", zValidator("json", UpdateReadingRemarkSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const result = await readingRemarkService.updateReadingRemark(id, body);
    return c.json(result);
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");

    const result = await readingRemarkService.removeReadingRemark(id);

    return c.json(result);
  });
