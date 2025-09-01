import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import {
  CreateMeterReaderScheduleReadingSchema,
  //CreateMeterReaderScheduleZoneBookSchema,
  CreateMonthScheduleSchema,
  CreateScheduleMeterReaderSchema,
  ScheduleQuerySchema,
} from "../types/schedule.type";

const scheduleService = meterReadingContext.getScheduleService();

const scheduleRoutes = new Hono()

  .get("/", zValidator("query", ScheduleQuerySchema), async (c) => {
    const { date } = c.req.valid("query");

    const isMonthOnly = /^\d{4}-\d{2}$/.test(date); // YYYY-MM
    const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(date); // YYYY-MM-DD

    if (isMonthOnly) {
      const [year, month] = date.split("-").map(Number);
      const result = await scheduleService.getScheduleByMonthYear(month, year);
      return c.json(result);
    }

    if (isFullDate) {
      const result = await scheduleService.getScheduleByDate(date);
      return c.json(result);
    }

    return c.json({ error: "Invalid date format" }, 400);
  })

  .post("/", zValidator("json", CreateMonthScheduleSchema.array()), async (c) => {
    const body = c.req.valid("json");
    const result = await scheduleService.addMonthYearSchedule(body);
    return c.json(result);
  })

  .delete("/", zValidator("query", ScheduleQuerySchema), async (c) => {
    const { date } = c.req.valid("query");

    const isMonthOnly = /^\d{4}-\d{2}$/.test(date); // YYYY-MM
    const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(date); // YYYY-MM-DD

    if (isMonthOnly) {
      const [year, month] = date.split("-").map(Number);
      const result = await scheduleService.deleteScheduleByMonthYear(month, year);
      return c.json(result);
    }

    if (isFullDate) {
      const result = await scheduleService.deleteScheduleByDate(date);
      return c.json(result);
    }

    return c.json({ error: "Invalid date format" }, 400);
  })

  .get("/meter-reader/:scheduleMeterReaderId/zone-books", async (c) => {
    const scheduleMeterReaderId = c.req.param("scheduleMeterReaderId");
    const result = await scheduleService.getMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId);
    return c.json(result);
  })

  .post("/meter-reader/zone-books", zValidator("json", CreateMeterReaderScheduleReadingSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await scheduleService.addMeterReaderScheduleZoneBook(body);

    return c.json(result, 201);
  })

  .delete("/meter-reader/:scheduleMeterReaderId", async (c) => {
    const scheduleMeterReaderId = c.req.param("scheduleMeterReaderId");
    const result = await scheduleService.deleteScheduleMeterReaderById(scheduleMeterReaderId);
    return c.json(result);
  })

  .post("/meter-reader", zValidator("json", CreateScheduleMeterReaderSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await scheduleService.addScheduleMeterReader(body);

    return c.json(result, 201);
  })

  .get("/zone-book", zValidator("query", ScheduleQuerySchema), async (c) => {
    const { date } = c.req.valid("query");

    const [year, month] = date.split("-").map(Number);

    const result = await scheduleService.getZoneBookScheduleReader(month, year);

    return c.json(result);
  });
export const scheduleHandler = new Hono().route("/schedules", scheduleRoutes);
