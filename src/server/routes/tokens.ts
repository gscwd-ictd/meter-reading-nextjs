import env from "@/lib/env";
import { TokenService } from "@/lib/tokenService";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";

export const tokensHandler = new Hono()
  .basePath("/tokens")
  .get("/jwks.json", async (c) => {
    const tokenService = new TokenService();
    const jwks = await tokenService.getJwks();
    return c.json({ ...jwks });
  })

  .get("/verify/:id", async (c) => {
    const id = c.req.param("id");
    const tokenService = new TokenService();

    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HTTPException(401, { message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const jwks = createRemoteJWKSet(new URL(`${env.APP_HOST}/api/tokens/jwks.json`));

    try {
      const jwt = await jwtVerify(token, jwks, {
        issuer: "GSCWD.meter_reading",
        audience: ["powersync", "powersync-dev"],
      });

      if (id !== jwt.payload.sub) {
        throw new Error("Invalid user for this token!");
      }

      return c.json({ token });
    } catch (err) {
      if (err instanceof JWTExpired) {
        const newToken = await tokenService.issueToken({ sub: id });
        return c.json({ accessToken: newToken.token });
      }

      console.error(err);
      throw new HTTPException(401, { message: "Invalid token!" });
    }
  });
