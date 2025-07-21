import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import { AssignMeterReaderSchema, MeterReaderQuerySchema } from "../types/meter-reader.type";
import { z } from "zod";

const meterReaderService = meterReadingContext.getMeterReaderService();

const meterReaderRoutes = new Hono()

  .get("/employee-details", zValidator("query", z.object({ query: z.string().default("") })), async (c) => {
    const { query } = c.req.valid("query");
    const result = await meterReaderService.getEmployeeDetailsByName(query);
    return c.json(result);
  })

  .get("/employee-details/:employeeId", async (c) => {
    const employeeId = c.req.param("employeeId");
    const result = await meterReaderService.getEmployeeDetailsById(employeeId);
    return c.json(result);
  })

  .get("/", zValidator("query", MeterReaderQuerySchema), async (c) => {
    const { page, limit, query, status } = c.req.valid("query");

    const meterReaders =
      status === "assigned"
        ? await meterReaderService.getAssignedMeterReaders(page, limit, query)
        : await meterReaderService.getUnassignedMeterReaders(page, limit, query);

    return c.json(meterReaders);
  })

  .get(
    "/zone-books",
    zValidator("query", z.object({ status: z.enum(["assigned", "unassigned", "all"]).default("all") })),
    async (c) => {
      const { status } = c.req.valid("query");
      const zoneBooks = await meterReaderService.getZoneBookByStatus(status);
      return c.json(zoneBooks);
    },
  )

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const meterReader = await meterReaderService.getMeterReaderWithZoneBookById(id);
    if (!meterReader) return c.json({ error: "Meter reader not found" }, 404);
    return c.json(meterReader);
  })

  .post("/", zValidator("json", AssignMeterReaderSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await meterReaderService.assignMeterReader(body);
    return c.json(result);
  })

  .put("/:id", zValidator("json", AssignMeterReaderSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const result = await meterReaderService.updateMeterReaderById(id, body);
    return c.json(result);
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await meterReaderService.deleteMeterReaderById(id);
    return c.json(result);
  });

export const meterReaderHandler = new Hono().route("/meter-readers", meterReaderRoutes);
