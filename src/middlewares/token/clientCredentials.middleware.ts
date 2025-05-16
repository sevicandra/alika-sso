import { NextFunction, Response } from "express";
import {
  Client,
  AuthorizationCode,
  User,
  RefreshToken,
} from "@/models";
import { errorResponse } from "@/helpers/respose.helper";
import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
  ConnectionError,
} from "sequelize";
import { AxiosError } from "axios";
import { JwtUtil } from "@/utils/jwt.util";
import { UUID } from "@/utils/uuid.util";
import { TokenRequest } from "@/types/auth";

export const clientCredentialsGrant = async (
  req: TokenRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.grant_type || !req.body.scope || !req.client) {
      return errorResponse(res, "Missing required parameters", null, 400);
    }

    if (!req.client.grant_types.includes("client_credentials")) {
      return errorResponse(res, "Invalid grant type", null, 401);
    }
    const reqScope = req.body.scope as string;
    const allScopesValid = reqScope.split(" ").every((s) => req.client?.scopes.includes(s))
    if (!allScopesValid) {
      return errorResponse(res, "Invalid scope", null, 403);
    }

    req.scope = req.body.scope;

    const access_token = await JwtUtil.generateToken({
      data: {
        userId: null,
        clientId: req.client.client_id,
        scope: req.body.scope,
      },
      expiresIn: "30m",
    });
    req.access_token = access_token;
    if (req.client.scopes.includes("refresh_token")) {
      const token = await RefreshToken.create({
        token: UUID.v4(),
        userId: null,
        clientId: req.client.client_id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        scope: req.body.scope,
      });
      const refreshToken = await JwtUtil.generateToken({
        data: {
          token: token.token,
        },
        expiresIn: "30d",
      });
      req.refresh_token = refreshToken;
    }
    return next();
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
