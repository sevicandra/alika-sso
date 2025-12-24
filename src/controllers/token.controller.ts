import { Response, Request } from "express";
import { AuthorizationCode, RefreshToken, User } from "@/repositories";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { AuthenticationError } from "@/utils/errors";
import { JwtUtil } from "@/utils/jwt.util";
import crypto from "crypto";

export const getToken = {
  authorizationCode: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new Error("Transaksi tidak ditemukan");
      }
      const { code, redirect_uri, client_id } = req.body;

      const authorizationCode = await AuthorizationCode.findOne({
        where: {
          code: code,
        },
      });

      if (!authorizationCode) {
        throw new AuthenticationError("Invalid code");
      }

      if (authorizationCode.redirect_uri !== redirect_uri) {
        throw new AuthenticationError("Invalid redirect uri");
      }

      if (client_id !== authorizationCode.client_id) {
        throw new AuthenticationError("Invalid client id");
      }

      const user = await User.findOne({
        where: {
          sub: authorizationCode.user_id,
        },
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
        transaction: t,
      });

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      req.scope = authorizationCode.scope;
      const accessToken = await JwtUtil.generateToken({
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
          scope: authorizationCode.scope,
        },
        expiresIn: "5m",
      });
      req.access_token = accessToken;
      if (req.client?.grant_types.includes("refresh_token")) {
        const generatedRefreshToken = crypto.randomBytes(32).toString("hex");

        const token = await RefreshToken.create({
          token: generatedRefreshToken,
          userId: user.sub,
          clientId: req.client.client_id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          scope: authorizationCode.scope,
        });
        const refreshToken = await JwtUtil.generateToken({
          data: {
            token: generatedRefreshToken,
            id: token.id,
            sessionId: authorizationCode.sessionId,
          },
          expiresIn: "1h",
        });
        req.refresh_token = refreshToken;
      }
      await AuthorizationCode.deleteOne(
        {
          where: {
            code: req.body.code,
          },
        },
        t
      );
      res.status(200).json({
        access_token: req.access_token,
        refresh_token: req.refresh_token,
        expires_in: 60 * 5,
        scope: req.scope,
      });
    },
    {
      useTransaction: true,
    }
  ),
};
