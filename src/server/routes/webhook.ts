import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z4 from "zod/v4";
import mssqlConn from "../db/mssql";

export const webhookHandler = new Hono().basePath("/webhook").post(
  "/test",
  zValidator(
    "json",
    z4.object({
      accountNo: z4.string(),
    }),
  ),
  async (c) => {
    const body = c.req.valid("json");
    const res = await mssqlConn.query`EXEC getAmountChangeMeter @AccountNo = ${body.accountNo}`;
    return c.json(res.recordset[0]);
  },
);
