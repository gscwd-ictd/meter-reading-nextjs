import { calculateJwkThumbprint, SignJWT, importPKCS8, importSPKI, exportJWK, JWTPayload } from "jose";

export class TokenService {
  private async generateJwk() {
    const publicKeyPem = Buffer.from(process.env.PUBLIC_KEY_B64!, "base64").toString("utf-8");
    const publicKey = await importSPKI(publicKeyPem, "RS256");

    return await exportJWK(publicKey);
  }

  public async getJwks() {
    const jwk = await this.generateJwk();

    // Assign additional fields
    jwk.kid = await calculateJwkThumbprint(jwk);
    jwk.use = "sig";
    jwk.alg = "RS256";

    // This object should now include all four fields
    return {
      keys: [jwk],
    };
  }

  public async issueToken(payload: JWTPayload) {
    const privateKeyPem = Buffer.from(process.env.PRIVATE_KEY_B64!, "base64").toString("utf-8");
    const privateKey = await importPKCS8(privateKeyPem, "RS256");

    const jwk = await this.generateJwk();
    const kid = await calculateJwkThumbprint(jwk);

    const jwt = await new SignJWT(payload)
      .setIssuer("GSCWD.meter_reading")
      .setProtectedHeader({ alg: "RS256", kid })
      .setAudience(["powersync", "powersync-dev"])
      .setIssuedAt()
      .setExpirationTime("60m")
      .sign(privateKey);

    return { token: jwt };
  }
}
