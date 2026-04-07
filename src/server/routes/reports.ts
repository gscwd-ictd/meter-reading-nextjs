import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod/v4";
import { ReadingAccountQuerySchema } from "../types/report.type";

const reportsService = meterReadingContext.getReportsService();

export const reportsHandler = new Hono()
  .basePath("/progress/")

  .get(
    "/zonebooks",
    zValidator(
      "query",
      z.object({
        date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Invalid date format (YYYY-MM)"),
      }),
    ),
    async (c) => {
      const { date } = c.req.valid("query");
      const [year, month] = date.split("-").map(Number);
      const result = await reportsService.getReadingZoneBookProgress(month, year);

      return c.json(result);
    },
  )

  .post("/zonebooks", zValidator("json", ReadingAccountQuerySchema), async (c) => {
    const body = c.req.valid("json");

    const result = await reportsService.getReadingAccountProgress(body);

    return c.json(result);
  })

  .patch("/reading", zValidator("json", ReadingAccountQuerySchema), async (c) => {
    const body = c.req.valid("json");

    const result = await reportsService.updateReadingProgress(body);

    return c.json(result);
  });
