import { ReadingDetailsRepository } from "@mr/lib/repositories/ReadingDetailsRepository";
import { ReadingDetailsService } from "@mr/lib/services/ReadingDetailsService";
import {
  CreateReadingDetailsSchema,
  UpdateReadingDetailsSchema,
} from "@mr/lib/validators/reading-details-schema";
import { zValidator } from "@hono/zod-validator";
import db from "@mr/server/db/connections";
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

    const readingDetails = await readingDetailsService.create(body);

    const currentUsage = readingDetails.currentReading ?? 0 - readingDetails.previousReading;

    if (readingDetails.isRead) {
      try {
        const res = await db.mssqlConn.query`
          EXEC post2Ledger 
            @accountNo = ${readingDetails.accountNumber}, 
            @readingDate = ${readingDetails.readingDate}, 
            @billDate = ${readingDetails.readingDate},
            @dueDate = ${readingDetails.dueDate},
            @disconDate = ${readingDetails.disconnectionDate},
            @presentReading = ${readingDetails.currentReading},
            @previousReading = ${readingDetails.previousReading},
            @presentUsage = ${currentUsage},
            @billedAmount = ${readingDetails.billedAmount},
            @penaltyAmount = ${readingDetails.penaltyAmount},
            @meterReader = ${readingDetails.meterReaderId},
            @seniorDiscount = ${readingDetails.seniorDiscount},
            @changeMeterAmount = ${readingDetails.changeMeterAmount},
            @arrears = ${readingDetails.arrears},
            @remarks = ${readingDetails.remarks},
            @timeStart = ${readingDetails.timeStart},
            @timeEnd = ${readingDetails.timeEnd}`;

        console.log(res.recordset);
      } catch (error) {
        console.error("Error sa mssql stored proc");
        throw error;
      }
    }

    return c.json(await readingDetailsService.create(body));
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
