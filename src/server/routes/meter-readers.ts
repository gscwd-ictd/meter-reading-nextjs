import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import { CreateAssignedMeterReaderSchema, MeterReaderQuerySchema } from "../types/meter-reader.type";

const meterReaderService = meterReadingContext.getMeterReaderService();

const meterReaderRoutes = new Hono()

  .get("/", zValidator("query", MeterReaderQuerySchema), async (c) => {
    const { page, limit, query, status } = c.req.valid("query");

    let meterReaders;

    if (status === "assigned") {
      meterReaders = await meterReaderService.getAssignedMeterReader(page, limit, query);
    } else {
      meterReaders = await meterReaderService.getUnassignedMeterReader(page, limit, query);
    }

    return c.json(meterReaders);
  })

  .post("/", zValidator("json", CreateAssignedMeterReaderSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await meterReaderService.addMeterReader(body);
    return c.json(result);
  });

// .get("/assignable", async (c) => {
//   const personnel = await personnelService.getPersonnel();
//   return c.json(personnel);
// })

/*   .get("/:id", async (c) => {
    const id = c.req.param("id");
    const meterReader = await meterReaderService.getMeterReaderById(id);
    if (!meterReader) return c.json({ error: "Meter reader not found" }, 404);
    return c.json(meterReader);
  }); */

export const meterReaderHandler = new Hono().route("/meter-readers", meterReaderRoutes);
