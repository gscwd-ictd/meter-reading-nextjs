import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { AuthSchema, loginAccounts, LoginSchema } from "../db/schemas/login-accounts";
import { eq } from "drizzle-orm";
import db from "../db/connections";
import argon2 from "argon2";
import { TokenService } from "@mr/lib/tokenService";

export const authHandler = new Hono()
  .basePath("/auth")
  .post("/register", zValidator("json", AuthSchema), async (c) => {
    const data = c.req.valid("json");

    const hashedPw = await argon2.hash(data.password);

    const result = await db.pgConn
      .insert(loginAccounts)
      .values({ ...data, password: hashedPw })
      .returning({
        meterReaderId: loginAccounts.meterReaderId,
        userId: loginAccounts.id,
        username: loginAccounts.username,
      });

    return c.json(result[0]);
  })

  .post("/login", zValidator("json", LoginSchema), async (c) => {
    const data = c.req.valid("json");

    const result = await db.pgConn
      .select()
      .from(loginAccounts)
      .where(eq(loginAccounts.username, data.username));

    if (result.length === 0) {
      console.error("User number not found!");
      throw new HTTPException(401, { message: "Invalid credentials!" });
    }

    const user = result[0];

    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid) {
      console.error("Password is invalid!");
      throw new HTTPException(401, { message: "Invalid credentials!" });
    }

    const tokenService = new TokenService();

    const { token } = await tokenService.issueToken({
      sub: user.id,
      meterReaderId: user.meterReaderId,
      //avatar: user.image,
    });

    return c.json({ token });
  });
