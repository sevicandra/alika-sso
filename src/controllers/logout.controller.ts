import { AuthenticatedRequest } from "@/types/auth";
import { Response } from "express";
import { JwtUtil } from "@/utils/jwt.util";
import { verify } from "@/utils/crypt.util";
import { RefreshToken } from "@/models";
import { errorResponse, successResponse } from "@/helpers/respose.helper";
import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
  ConnectionError,
} from "sequelize";
import { AxiosError } from "axios";
import { Session } from "@/models";

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const refresh_token = req.body.refresh_token;
    const decoded: any = await JwtUtil.verifyToken(refresh_token);
    const token = decoded.token;
    const sessionId = decoded.sessionId;
    const { sub } = req.user;
    if (!token) {
      return errorResponse(res, "Invalid refresh token", null, 403);
    }

    const refreshToken = await RefreshToken.findByPk(decoded.id);

    if (!refreshToken) {
      return errorResponse(res, "Invalid refresh token", null, 403);
    }

    if (refreshToken.userId !== sub) {
      return errorResponse(res, "Invalid client", null, 403);
    }
    if (!(await verify(token, refreshToken.token))) {
      return errorResponse(res, "Invalid refresh token", null, 403);
    }
    await refreshToken.destroy();
    await Session.findByPk(sessionId).then(async (session) => {
      if (session) {
        await session.destroy();
      }
    });
    res.clearCookie(`${process.env.APP_NAME || "SSO"}.session`);
    return successResponse(res, "Logout berhasil", null, 200);
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
