import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { CreateAssignedZoneBookSchema } from "../types/zone-book.type";

const zoneBookService = meterReadingContext.getZoneBookService();

const zoneBookRoutes = new Hono()
  .get("/", async (c) => {
    const result = await zoneBookService.getZoneBook();
    return c.json(result);
  })

  .get("/unassigned", async (c) => {
    const result = await zoneBookService.getUnassignedAreaZoneBook();
    return c.json(result);
  })

  .get("/assigned", async (c) => {
    const result = await zoneBookService.getAssignedAreaZoneBook();
    return c.json(result);
  })

  .post("/", zValidator("json", CreateAssignedZoneBookSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await zoneBookService.addAssignedAreaZoneBook(body);
    return c.json(result, 201);
  });

// Export a handler with prefix /zone-book
export const zoneBookHandler = new Hono().route("/zone-book", zoneBookRoutes);

/* 
  # get method
  # all zone book 
  /zone-book

  # get method
  # unassigned zone book area
  /zone-book/unassigned

  # get method
  # assigned zone book area
  /zone-book/assigned

  # post method
  # assigned zone book an area
  /zone-book

*/
