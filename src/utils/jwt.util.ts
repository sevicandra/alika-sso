import fs from "fs";
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { StringValue } from "ms";
import * as jose from "node-jose";
import path from "path";
import { appConfig } from "@/config/app.config";
import { access_token, refresh_token, user_access_token } from "@/types/auth";
import logger from "./Logger.utils";

export class JwtUtil {
  private static publicKey: string = "";
  private static privateKey: string = "";
  private static initialized = false;

  static async initialize(): Promise<void> {
    try {
      const publicKeyPath = process.env.PUBLIC_KEY_FILE || path.join(__dirname, "../../public.pem");

      const privateKeyPath =
        process.env.PRIVATE_KEY_FILE || path.join(__dirname, "../../private.key");

      if (!fs.existsSync(publicKeyPath)) {
        throw new Error(`Public key file not found: ${publicKeyPath}`);
      }
      if (!fs.existsSync(privateKeyPath)) {
        throw new Error(`Private key file not found: ${privateKeyPath}`);
      }

      this.publicKey = fs.readFileSync(publicKeyPath, "utf8");
      this.privateKey = fs.readFileSync(privateKeyPath, "utf8");

      try {
        const testData = { test: true, iat: Date.now() };
        const testToken = jwt.sign(testData, this.privateKey, {
          algorithm: "RS256",
          expiresIn: "1m",
          issuer: appConfig.URL,
        });

        jwt.verify(testToken, this.publicKey, {
          issuer: appConfig.URL,
        });

        logger.info("JWT keys validated successfully");
      } catch (error) {
        throw new Error(
          `JWT keys are invalid or don't match: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      this.initialized = true;
    } catch (error) {
      logger.error("Failed to initialize JWT", { error });
      throw error;
    }
  }

  private static ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("JwtUtil not initialized. Call JwtUtil.initialize() first.");
    }
  }

  static async generateToken({
    data,
    expiresIn = "1h",
  }: {
    data: access_token | refresh_token | user_access_token;
    expiresIn?: StringValue;
  }): Promise<string> {
    this.ensureInitialized();

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
    this.ensureInitialized();

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
    this.ensureInitialized();

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
