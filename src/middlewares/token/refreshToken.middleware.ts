import { NextFunction, Response } from "express";
import { User, RefreshToken } from "@/models";
import { errorResponse } from "@/helpers/respose.helper";
import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
  ConnectionError,
} from "sequelize";
import { AxiosError } from "axios";
import { JwtUtil } from "@/utils/jwt.util";
import { TokenRequest } from "@/types/auth";
import { verify } from "@/utils/crypt.util";
import crypto from "crypto";

export const refreshTokenGrant = async (
  req: TokenRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.grant_type || !req.body.refresh_token || !req.client) {
      return errorResponse(res, "Missing required parameters", null, 400);
    }

    if (!req.client.grant_types.includes("refresh_token")) {
      return errorResponse(res, "Invalid grant type", null, 401);
    }
    const token = await JwtUtil.verifyToken(req.body.refresh_token);
    if (!token) {
      return errorResponse(res, "Invalid refresh token", null, 401);
    }
    const refreshToken = await RefreshToken.findByPk(token.id);

    if (!refreshToken) {
      return errorResponse(res, "Invalid refresh token", null, 401);
    }
    if (refreshToken.clientId !== req.client.client_id) {
      return errorResponse(res, "Invalid client", null, 401);
    }
    if (!(await verify(token.token, refreshToken.token))) {
      return errorResponse(res, "Invalid token", null, 401);
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
        return errorResponse(res, "Invalid user", null, 401);
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
        clientId: req.client.client_id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        scope: req.scope || "",
      });
      const refresh_token = await JwtUtil.generateToken({
        data: {
          token: generatedRefreshToken,
          id: token.id,
          sessionId: sessionId,
        },
        expiresIn: "1h",
      });

      req.refresh_token = refresh_token;
      return next();
    } else {
      const access_token = await JwtUtil.generateToken({
        data: {
          clientId: req.client.client_id,
          scope: req.scope || "",
        },
        expiresIn: "5m",
      });

      req.access_token = access_token;
      const generatedRefreshToken = crypto.randomBytes(32).toString("hex");
      const token = await RefreshToken.create({
        token: generatedRefreshToken,
        userId: null,
        clientId: req.client.client_id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        scope: req.scope || "",
      });
      const refresh_token = await JwtUtil.generateToken({
        data: {
          token: generatedRefreshToken,
          id: token.id,
        },
        expiresIn: "1h",
      });

      req.refresh_token = refresh_token;
      return next();
    }
  } catch (error: unknown) {
    if (
      error instanceof ValidationError ||
      error instanceof UniqueConstraintError
    ) {
      const parsedErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return errorResponse(res, "Validation gagal", parsedErrors, 422);
    } else if (
      error instanceof DatabaseError ||
      error instanceof ConnectionError
    ) {
      const parsedErrors = error.message;
      return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
    } else if (error instanceof ConnectionError) {
      const parsedErrors = { message: "Gagal terhubung ke database" };
      return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
    } else if (error instanceof AxiosError) {
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as AxiosError).isAxiosError
      ) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status || 500;
        const message =
          (axiosError.response?.data as { message?: string })?.message ||
          axiosError.message ||
          "Kesalahan pada permintaan eksternal";
        const details = axiosError.response?.data || null;
        return errorResponse(res, message, details, statusCode);
      }
      return errorResponse(res, "Terjadi kesalahan", null, 500);
    } else if (error instanceof Error) {
      const parsedErrors = { message: error.message };
      return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
    } else {
      const parsedErrors = { message: "Kesalahan tidak diketahui" };
      return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
    }
  }
};
