import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { CreateAssignedPersonnelSchema, PersonnelQuerySchema } from "../types/personnel.type";
import { zValidator } from "@hono/zod-validator";

const personnelService = meterReadingContext.getPersonnelService();

const personnelRoutes = new Hono()

  .get("/", zValidator("query", PersonnelQuerySchema), async (c) => {
    const { page, limit, query, status } = c.req.valid("query");

    let personnel;

    if (status === "assigned") {
      personnel = await personnelService.getAssignedPersonnel(page, limit, query);
    } else {
      personnel = await personnelService.getUnassignedPersonnel(page, limit, query);
    }

    return c.json(personnel);
  })

  .post("/", zValidator("json", CreateAssignedPersonnelSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await personnelService.addPersonnel(body);
    return c.json(result);
  });

// .get("/assignable", async (c) => {
//   const personnel = await personnelService.getPersonnel();
//   return c.json(personnel);
// })

// .get("/:id", async (c) => {
//   const id = c.req.param("id");
//   const personnel = await personnelService.getPersonnelById(id);
//   if (!personnel) return c.json({ error: "Personnel not found" }, 404);
//   return c.json(personnel);
// });

export const personnelHandler = new Hono().route("/personnel", personnelRoutes);
