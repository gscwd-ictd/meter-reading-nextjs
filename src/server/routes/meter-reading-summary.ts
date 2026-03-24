import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import { BilledAccountQuerySchema, MobileSummaryQuerySchema } from "../types/report.type";
import z4 from "zod/v4";

const meterReadingSummaryService = meterReadingContext.getMeterReadingSummaryService();

const summaryReadingQuerySchema = z4.object({
  readingMonth: z4.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
});

const meterReadingSummaryRoutes = new Hono()

  .get("/billed", zValidator("query", BilledAccountQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const result = await meterReadingSummaryService.getBilledSummary(query);
    return c.json(result, 200);
  })

  .get("/unbilled", zValidator("query", BilledAccountQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const result = await meterReadingSummaryService.getUnbilledSummary(query);
    return c.json(result, 200);
  })

  .get("/remarks", zValidator("query", BilledAccountQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const result = await meterReadingSummaryService.getWithRemarksSummary(query);
    return c.json(result, 200);
  })

  .get("/new-meter", zValidator("query", BilledAccountQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const result = await meterReadingSummaryService.getNewMeterSummary(query);
    return c.json(result, 200);
  })

  .get("/monthly-billing", zValidator("query", summaryReadingQuerySchema), async (c) => {
    const { readingMonth } = c.req.valid("query");

    const result = await meterReadingSummaryService.getMonthBillingSummary(readingMonth);
    return c.json(result, 200);
  })

  .post("/mobile", zValidator("json", MobileSummaryQuerySchema), async (c) => {
    const data = c.req.valid("json");
    const result = await meterReadingSummaryService.mobileSummaryReport(data);

    return c.json(result);
  });

export const meterReadingSummaryHandler = new Hono().route("summary", meterReadingSummaryRoutes);
