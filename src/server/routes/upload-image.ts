import { zValidator } from "@hono/zod-validator";
import { meterReadingContext } from "../context";
import { Hono } from "hono";
import { UploadImageSchema } from "../types/upload.type";

const uploadImageService = meterReadingContext.getUploadImageService();

const uploadImageRoutes = new Hono().post("/", zValidator("form", UploadImageSchema), async (c) => {
  const body = c.req.valid("form");
  const result = await uploadImageService.uploadImage(body);

  return c.json(result, 201);
});

export const uploadImageHandler = new Hono().route("/upload-image", uploadImageRoutes);
