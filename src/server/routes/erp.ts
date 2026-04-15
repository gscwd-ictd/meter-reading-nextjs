import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import { ReadingAccountQuerySchema } from "../types/report.type";

const erpService = meterReadingContext.getErpService();

export const erpHandler = new Hono()
  .basePath("/erp")

  .get("/summary-accounts", zValidator("query", ReadingAccountQuerySchema), async (c) => {
    const query = c.req.valid("query");

    const result = await erpService.getAllReadingAccount(query);
    return c.json(result);
  });
