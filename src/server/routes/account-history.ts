import { AccountHistoryRepository } from "@/lib/repositories/AccountHistoryRepository";
import { AccountHistoryService } from "@/lib/services/AccountHistoryService";
import {
  CreateAccountHistorySchema,
  UpdateAccountHistorySchema,
} from "@/lib/validators/account-history-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const accountHistoryRepository = new AccountHistoryRepository();
const accountHistoryService = new AccountHistoryService(accountHistoryRepository);

export const accountHistoryHandler = new Hono()
  .basePath("account-history")
  .get("/", async (c) => {
    return c.json(accountHistoryService.getAll());
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(accountHistoryService.getById(id));
  })
  .post("/", zValidator("json", CreateAccountHistorySchema), async (c) => {
    const body = c.req.valid("json");
    return c.json(accountHistoryService.create(body));
  })
  .patch("/:id", zValidator("json", UpdateAccountHistorySchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    return c.json(accountHistoryService.update(id, body));
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    return c.json(accountHistoryService.delete(id));
  });
