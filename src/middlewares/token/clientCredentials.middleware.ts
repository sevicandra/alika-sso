import { Request, Response, NextFunction } from "express";
import { RefreshToken } from "@/models";
import { JwtUtil } from "@/utils/jwt.util";
import crypto from "crypto";
import { asyncHandler } from "../async-handler.middleware";
import { AuthenticationError } from "@/utils/errors";

export const clientCredentialsGrant = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const t = req.transaction;
    if (!t) {
      throw new Error("Transaksi tidak ditemukan");
    }
    const { client } = req;
    const { scope: reqScope } = req.body;
    if (!client?.grant_types.includes("client_credentials")) {
      throw new AuthenticationError("Invalid grant type");
    }
    const validScopes = reqScope
      .split(" ")
      .filter((s: string) => req.client?.scopes.includes(s))
      .join(" ");
    req.scope = validScopes;
    const access_token = await JwtUtil.generateToken({
      data: {
        clientId: client?.client_id,
        scope: req.scope || "",
      },
      expiresIn: "5m",
    });
    req.access_token = access_token;
    if (client?.grant_types.includes("refresh_token")) {
      const generatedRefreshToken = crypto.randomBytes(32).toString("hex");
      const token = await RefreshToken.create({
        token: generatedRefreshToken,
        userId: null,
        clientId: client.client_id,
        expiresAt: new Date(Date.now() + 45 * 60 * 1000),
        scope: req.scope || "",
      });
      const refreshToken = await JwtUtil.generateToken({
        data: {
          token: generatedRefreshToken,
          id: token.id,
        },
        expiresIn: "45m",
      });
      req.refresh_token = refreshToken;
    }
    next();
  },
  {
    useTransaction: true,
  }
);
