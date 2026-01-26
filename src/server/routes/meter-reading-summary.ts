import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import { BilledAccountQuerySchema } from "../types/report.type";

const meterReadingSummaryService = meterReadingContext.getMeterReadingSummaryService();

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

  .get("/remarks", async (c) => {
    return c.json("remarks", 200);
  })

  .get("/new-meter", async (c) => {
    return c.json("new-meter", 200);
  })

  .get("/mobile", async (c) => {
    const data = { meterReaderId: "3c2f91fe-db2b-4003-bfab-40f5b67813f5", datetimeCompleted: "2026-01-26" };
    const result = await meterReadingSummaryService.mobileSummaryReport(data);

    return c.json(result);
  });

export const meterReadingSummaryHandler = new Hono().route("summary", meterReadingSummaryRoutes);
