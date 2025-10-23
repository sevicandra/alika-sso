import { NextFunction, Response } from "express";
import { AuthorizationCode, User, RefreshToken, sequelize } from "@/models";
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
import crypto from "crypto";

export const authorizationCodeGrant = async (
  req: TokenRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.body.grant_type ||
    !req.body.code ||
    !req.body.redirect_uri ||
    !req.client
  ) {
    return errorResponse(res, "Missing required parameters", null, 400);
  }
  const t = await sequelize.transaction();

  try {
    if (!req.client.grant_types.includes("authorization_code")) {
      return errorResponse(res, "Invalid grant type", null, 401);
    }

    if (!req.client.redirect_uris.includes(req.body.redirect_uri)) {
      return errorResponse(res, "Invalid redirect uri", null, 401);
    }

    const authorizationCode = await AuthorizationCode.findOne({
      where: {
        code: req.body.code,
      },
    });

    if (!authorizationCode) {
      return errorResponse(res, "Invalid code", null, 401);
    }

    if (authorizationCode.redirect_uri !== req.body.redirect_uri) {
      return errorResponse(res, "Invalid redirect uri", null, 401);
    }

    if (req.client.client_id !== authorizationCode.client_id) {
      return errorResponse(res, "Invalid client id", null, 401);
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
      return errorResponse(res, "User not found", null, 401);
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
    if (req.client.grant_types.includes("refresh_token")) {
      const generatedRefreshToken = crypto.randomBytes(32).toString("hex");

      const token = await RefreshToken.create({
        token: generatedRefreshToken,
        userId: user.sub,
        clientId: req.client.client_id,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        scope: authorizationCode.scope,
      });
      const refreshToken = await JwtUtil.generateToken({
        data: {
          token: generatedRefreshToken,
          id: token.id,
          sessionId: authorizationCode.sessionId,
        },
        expiresIn: "4h",
      });
      req.refresh_token = refreshToken;
    }
    await AuthorizationCode.destroy({
      where: {
        code: req.body.code,
      },
      transaction: t,
    });
    await t.commit();
    return next();
  } catch (error: unknown) {
    console.log(error);

    await t.rollback();
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
