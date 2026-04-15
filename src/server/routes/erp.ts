import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import z from "zod/v4";

const erpService = meterReadingContext.getErpService();

const querySchema = z.object({
  readingMonth: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
});

export const erpHandler = new Hono()
  .basePath("/erp")

  .get("/summary-accounts", zValidator("query", querySchema), async (c) => {
    const { readingMonth } = c.req.valid("query");

    const result = await erpService.getAllReadingAccount(readingMonth);
    return c.json(result);
  });
