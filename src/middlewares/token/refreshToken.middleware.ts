import { Request, Response, NextFunction } from "express";
import { User, RefreshToken } from "@/models";
import { JwtUtil } from "@/utils/jwt.util";
import { verify } from "@/utils/crypt.util";
import crypto from "crypto";
import { asyncHandler } from "../async-handler.middleware";
import { AuthenticationError } from "@/utils/errors";

export const refreshTokenGrant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const t = req.transaction;
    if (!t) {
      throw new Error("Transaksi tidak ditemukan");
    }
    const { client } = req;

    const token = await JwtUtil.verifyToken(req.body.refresh_token);
    if (!token) {
      throw new AuthenticationError("Invalid refresh token");
    }
    const refreshToken = await RefreshToken.findByPk(token.id);
    if (!refreshToken) {
      throw new AuthenticationError("Invalid refresh token");
    }
    if (refreshToken.clientId !== client?.client_id) {
      throw new AuthenticationError("Invalid client");
    }
    if (!(await verify(token.token, refreshToken.token))) {
      throw new AuthenticationError("Invalid token");
    }
    if (req.body.scope) {
      const validScopes = req.body.scope
        .split(" ")
        .filter((s: string) => req.client?.scopes.includes(s))
        .join(" ");
      req.scope = validScopes;
    } else {
      req.scope = refreshToken.scope;
    }
    const userId = refreshToken.userId || null;
    const sessionId = token.sessionId;
    refreshToken.destroy();
    if (userId) {
      const user = await User.findOne({
        where: { sub: userId },
        include: [
          {
            association: "UserAssignments",
            include: [
              {
                association: "Roles",
              },
              {
                association: "Service",
              },
            ],
          },
        ],
      });
      if (!user) {
        throw new AuthenticationError("Invalid user");
      }
      const access_token = await JwtUtil.generateToken({
        data: {
          sub: user.sub,
          name: user.name,
          nik: user.nik,
          nip: user.nip,
          kode_satker: user.kode_satker,
          satker: user.satker,
          gravatar: user.gravatar,
          account:
            user.UserAssignments?.map((u) => {
              return {
                service: u.Service.name,
                kode_satker: u.kd_satker,
                roles:
                  u.Roles?.map((r) => {
                    return {
                      kode: r.kode,
                      nama: r.role,
                    };
                  }) || [],
              };
            }) || [],
          scope: req.scope || "",
        },
        expiresIn: "5m",
      });

      req.access_token = access_token;
      const generatedRefreshToken = crypto.randomBytes(32).toString("hex");
      const token = await RefreshToken.create({
        token: generatedRefreshToken,
        userId: userId,
        clientId: client.client_id,
        expiresAt: new Date(Date.now() + 45 * 60 * 1000),
        scope: req.scope || "",
      });
      const refresh_token = await JwtUtil.generateToken({
        data: {
          token: generatedRefreshToken,
          id: token.id,
          sessionId: sessionId,
        },
        expiresIn: "45m",
      });

      req.refresh_token = refresh_token;
    } else {
      const access_token = await JwtUtil.generateToken({
        data: {
          clientId: client.client_id,
          scope: req.scope || "",
        },
        expiresIn: "5m",
      });
      req.access_token = access_token;
      const generatedRefreshToken = crypto.randomBytes(32).toString("hex");
      const token = await RefreshToken.create({
        token: generatedRefreshToken,
        userId: null,
        clientId: client.client_id,
        expiresAt: new Date(Date.now() + 45 * 60 * 1000),
        scope: req.scope || "",
      });
      const refresh_token = await JwtUtil.generateToken({
        data: {
          token: generatedRefreshToken,
          id: token.id,
        },
        expiresIn: "45m",
      });
      req.refresh_token = refresh_token;
    }
    next();
  },
  {
    useTransaction: true,
  }
);
