import jwt from "jsonwebtoken";
import { AuthenticationError } from "../utils/errors";
import logger from "@/utils/Logger.utils";
import fs from "fs";
import path from "path";

class key {
  static publicKey = fs.readFileSync(
    (process.env.PUBLIC_KEY_FILE as string) || path.join(__dirname, "../../public.pem"),
    "utf8"
  );
  static privateKey = fs.readFileSync(
    (process.env.PRIVATE_KEY_FILE as string) || path.join(__dirname, "../../private.key"),
    "utf8"
  );
}

export interface JWTPayload {
  sub?: string;
  clientId?: string;
  scope: string;
  name: string;
  nik: string;
  nip: string;
  kode_satker: string;
  satker: string;
  gravatar: string;
  account: {
    service: string;
    kode_satker: string | null;
    roles: {
      kode: string;
      nama: string;
    }[];
  }[];
}

export class AuthService {
  publicKeyCache: string | null = null;
  publicKeyExpiration: number = 0;
  cacheDuration: number = 60 * 60 * 1000; // 1 hour

  async getPublicKey(): Promise<string> {
    const now = Date.now();
    if (this.publicKeyCache && now < this.publicKeyExpiration) {
      return this.publicKeyCache;
    }

    const publicKey = key.publicKey;
    this.publicKeyCache = publicKey;
    this.publicKeyExpiration = now + this.cacheDuration;
    return publicKey;
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      return jwt.verify(token, await this.getPublicKey(), {
        issuer: process.env.ALIKA_AUTH_ISSUER,
      }) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError("Token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError("Invalid token");
      }
      if (error instanceof jwt.NotBeforeError) {
        throw new AuthenticationError("Token not yet valid");
      }

      logger.error("Token verification failed", {
        error: error instanceof Error ? error.message : String(error),
      });

      throw new AuthenticationError("Token verification failed");
    }
  }

  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload | null;
    } catch (error) {
      logger.warn("Token decode failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }
}

export const authService = new AuthService();
