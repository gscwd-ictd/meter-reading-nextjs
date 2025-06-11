import { Hono } from "hono";
import { exportJWK, importSPKI, calculateJwkThumbprint, SignJWT, importPKCS8 } from "jose";
import env from "@mr/lib/env";


const generateJwk = async () => {
  const publicKeyPem = Buffer.from(env.PUBLIC_KEY_B64, "base64").toString("utf-8");
  const publicKey = await importSPKI(publicKeyPem, "RS256");

  const jwk = await exportJWK(publicKey);

  return jwk;
};

export const powersyncHandler = new Hono()
  .basePath("/.well-known")
  .get("/jwks.json", async (c) => {
    const jwk = await generateJwk();

    jwk.kid = await calculateJwkThumbprint(jwk);
    jwk.use = "sig";
    jwk.alg = "RS256";

    return c.json({
      keys: [jwk],
    });
  })
  .get("/token", async (c) => {
    const privateKeyPem = Buffer.from(env.PRIVATE_KEY_B64, "base64").toString("utf-8");
    const privateKey = await importPKCS8(privateKeyPem, "RS256");

    const jwk = await generateJwk();
    const kid = await calculateJwkThumbprint(jwk);

    const jwt = await new SignJWT()
      .setProtectedHeader({ alg: "RS256", kid })
      .setAudience(["powersync", "powersync-dev"])
      .setIssuedAt()
      .setExpirationTime("60m")
      .sign(privateKey);

    return c.json({ token: jwt });
  });
