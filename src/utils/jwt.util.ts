import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { StringValue } from "ms";
import fs from "fs";
import { appConfig } from "@/config/app.config";
import path from "path";
import * as jose from "node-jose";
import { access_token, refresh_token, user_access_token } from "@/types/auth";

export class JwtUtil {
  private static publicKey = fs.readFileSync(
    (process.env.PUBLIC_KEY_FILE as string) ||
      path.join(__dirname, "../../public.pem"),
    "utf8"
  );
  private static privateKey = fs.readFileSync(
    (process.env.PRIVATE_KEY_FILE as string) ||
      path.join(__dirname, "../../private.key"),
    "utf8"
  );

  static async generateToken({
    data,
    expiresIn = "1h",
  }: {
    data: access_token | refresh_token | user_access_token;
    expiresIn?: StringValue;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign(data, this.privateKey, {
          algorithm: "RS256",
          expiresIn: expiresIn,
          issuer: appConfig.URL,
        });
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(token, this.publicKey, {
          issuer: appConfig.URL,
        });
        resolve(decoded);
      } catch (error: unknown) {
        if (error instanceof TokenExpiredError) {
          reject(error.message);
        } else if (error instanceof NotBeforeError) {
          reject(error.message);
        } else if (error instanceof JsonWebTokenError) {
          reject(error.message);
        } else if (error instanceof Error) {
          reject(error.message);
        } else {
          reject("unknown error");
        }
      }
    });
  }
  static async getJWKS() {
    const key = await jose.JWK.asKey(this.publicKey, "pem");
    const jwk = key.toJSON(true) as jose.JWK.RawKey & {
      use?: string;
      alg?: string;
      x5c?: string[];
      x5t?: string;
    };

    jwk.use = "sig";
    jwk.alg = "RS256";

    const cert = this.publicKey.replace(
      /-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g,
      ""
    );
    jwk.x5c = [cert];
    jwk.x5t = Buffer.from(cert, "base64").toString("hex");

    return { keys: [jwk] };
  }
}
