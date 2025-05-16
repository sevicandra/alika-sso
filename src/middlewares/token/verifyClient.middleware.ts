import { TokenRequest } from "@/types/auth";
import { errorResponse } from "@/helpers/respose.helper";
import { NextFunction, Response } from "express";
import { Client, ClientScope } from "@/models";
import { verify } from "@/utils/crypt.util";
import { AxiosError } from "axios";
import { clientCredentialsGrant } from "./clientCredentials.middleware";
import { authorizationCodeGrant } from "./authorizationCode.middleware";
import { refreshTokenGrant } from "./refreshToken.middleware";
import sequelize from "@/config/db.config";
import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
  ConnectionError,
} from "sequelize";

export const verifyClient = async (
  req: TokenRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const decode = async (authorization: string) => {
      return Buffer.from(authorization, "base64").toString("utf-8");
    };
    const client_id =
      (await req.body.client_id) ||
      (req.headers.authorization?.split(" ")[1]?.toString() &&
        (
          await decode(req.headers.authorization?.split(" ")[1]?.toString())
        ).split(":")[0]);

    const client_secret =
      (await req.body.client_secret) ||
      (req.headers.authorization?.split(" ")[1]?.toString() &&
        (
          await decode(req.headers.authorization?.split(" ")[1]?.toString())
        ).split(":")[1]);
    const grant_type = await req.body.grant_type;
    if (!client_id || !client_secret || !grant_type) {
      return errorResponse(res, "Missing required parameters", null, 400);
    }

    const client = await Client.scope("withSecret").findOne({
      where: { client_id: client_id },
      include: [
        {
          association: "GrantTypes",
        },
        {
          association: "Scopes",
        },
        {
          association: "RedirectUris",
        },
      ],
    });
    if (!client) {
      return errorResponse(res, "Client not found", null, 401);
    }
    if (!(await verify(client_secret, client.client_secret))) {
      return errorResponse(res, "Invalid client", null, 401);
    }
    req.client = {
      id: client.id,
      client_id: client.client_id,
      grant_types: client.GrantTypes.map((gt) => gt.grant),
      scopes: client.Scopes.map(
        (s) => s.Scope.Service.name + "." + s.Scope.scope + "." + s.Action.name
      ),
      redirect_uris: client.RedirectUris.map((ru) => ru.uri),
    };
    switch (req.body.grant_type) {
      case "client_credentials":
        return clientCredentialsGrant(req, res, next);
      case "authorization_code":
        return authorizationCodeGrant(req, res, next);
      case "refresh_token":
        return refreshTokenGrant(req, res, next);
      default:
        return errorResponse(res, "Invalid grant type", null, 400);
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
