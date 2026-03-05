import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import z from "zod/v4";

const reportsService = meterReadingContext.getReportsService();

const meterReadingScheduleQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
});

export const summaryHandler = new Hono()
  .basePath("/summary/")

  .get("/meter-reading/schedule", zValidator("query", meterReadingScheduleQuerySchema), async (c) => {
    const { date } = c.req.valid("query");

    const [year, month] = date.split("-").map(Number);
    const result = await reportsService.meterReadingScheduleSummary(month, year);
    return c.json(result);
  });
