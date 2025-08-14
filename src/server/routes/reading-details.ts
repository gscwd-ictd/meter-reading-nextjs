import { ReadingDetailsRepository } from "@mr/lib/repositories/ReadingDetailsRepository";
import { ReadingDetailsService } from "@mr/lib/services/ReadingDetailsService";
import {
  CreateReadingDetailsSchema,
  UpdateReadingDetailsSchema,
} from "@mr/lib/validators/reading-details-schema";
import { zValidator } from "@hono/zod-validator";
import db from "@mr/server/db/connections";
import { Hono } from "hono";
import { format } from "date-fns";

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

    return c.json(await readingDetailsService.create(body));
  })
  .patch("/:id", zValidator("json", UpdateReadingDetailsSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    console.log({ body });

    const readingDetails = await readingDetailsService.update(id, body);

    console.log({ readingDetails });

    if (readingDetails.isRead) {
      const readingDate = format(readingDetails.readingDate!, "MM/dd/yyyy");
      const dueDate = format(readingDetails.dueDate!, "MM/dd/yyyy");
      const disconnectionDate = format(readingDetails.disconnectionDate!, "MM/dd/yyyy");
      const timeStart = format(readingDetails.timeStart!, "MM/dd/yyyy h:mm a");
      const timeEnd = format(readingDetails.timeEnd!, "MM/dd/yyyy h:mm a");
      const currentUsage = readingDetails.currentReading ?? 0 - readingDetails.previousReading;

      console.log({
        accountNo: readingDetails.accountNumber,
        readingDate,
        billDate: readingDate,
        dueDate,
        disconDate: disconnectionDate,
        presentReading: readingDetails.currentReading,
        previousReading: readingDetails.previousReading,
        presentUsage: currentUsage,
        billedAmount: readingDetails.billedAmount,
        penaltyAmount: readingDetails.penaltyAmount,
        meterReader: body.meterReader,
        seniorDiscount: readingDetails.seniorDiscount,
        changeMeterAmount: readingDetails.changeMeterAmount,
        arrears: readingDetails.arrears,
        remarks: readingDetails.remarks,
        timeStart,
        timeEnd,
        currentUsage,
      });

      try {
        //TODO: change meterReader field
        const res = await db.mssqlConn.query`
          EXEC post2Ledger
            @accountNo = ${readingDetails.accountNumber},
            @readingDate = ${readingDate},
            @billDate = ${readingDate},
            @dueDate = ${dueDate},
            @disconDate = ${disconnectionDate},
            @presentReading = ${readingDetails.currentReading},
            @previousReading = ${readingDetails.previousReading},
            @presentUsage = ${currentUsage},
            @billedAmount = ${readingDetails.billedAmount},
            @penaltyAmount = ${readingDetails.penaltyAmount},
            @meterReader = 'john doe',
            @seniorDiscount = ${readingDetails.seniorDiscount},
            @changeMeterAmount = ${readingDetails.changeMeterAmount},
            @arrears = ${readingDetails.arrears},
            @remarks = ${readingDetails.remarks},
            @timeStart = ${timeStart},
            @timeEnd = ${timeEnd}`;

        console.log(res);

        console.log(res.recordsets);
      } catch (error) {
        console.error("Error sa mssql stored proc");
        throw error;
      }
    }

    return c.json(readingDetails);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(await readingDetailsService.delete(id));
  });
