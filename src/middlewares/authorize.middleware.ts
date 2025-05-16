import { Client } from "@/models";
import { errorResponse } from "@/helpers/respose.helper";
import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
  ConnectionError,
} from "sequelize";
import { AxiosError } from "axios";
export const checkRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response_type = req.query.response_type as string;
    const redirectUri = req.query.redirect_uri as string;
    const clientId = req.query.client_id as string;
    const scope = req.query.scope as string;
    if (!response_type || !redirectUri || !clientId || !scope) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    if (response_type !== "code") {
      return res
        .status(400)
        .json({ error: "Invalid grant type or response type" });
    }
    const client = await Client.findOne({
      where: { client_id: clientId },
      include: [
        {
          association: "GrantTypes",
          attributes: ["grant"],
        },
        {
          association: "RedirectUris",
          attributes: ["uri"],
        },
        {
          association: "Scopes",
          attributes: ["scope"],
        },
      ],
    });
    if (!client) {
      return errorResponse(res, "Client is not valid", null, 403);
    }
    if (!client.GrantTypes || !client.RedirectUris || !client.Scopes) {
      return errorResponse(res, "Client is not valid", null, 403);
    }
    if (!client.GrantTypes.map((g) => g.grant).includes("authorization_code")) {
      return errorResponse(res, "Client grant is not valid", null, 403);
    }
    if (!client.RedirectUris.map((r) => r.uri).includes(redirectUri)) {
      return errorResponse(res, "Client redirect uri is not valid", null, 403);
    }
    const clientScopes = client.Scopes.map(
      (s) => s.Scope.Service.name + "." + s.Scope.scope + "." + s.Action.name
    );
    const allScopesValid = scope.split(" ").every((s) => clientScopes.includes(s))
    if (!allScopesValid) {
      return errorResponse(res, "Client scope is not valid", null, 403);
    }
    next();
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
