import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/auth";
import { errorResponse } from "@/helpers/respose.helper";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { omit } from "lodash";
import { JwtUtil } from "@/utils/jwt.util";
import { appConfig } from "@/config/app.config";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect(
      appConfig.URL + "/login?ReturnUrl=" + encodeURIComponent(req.originalUrl)
    );
  }
};

export function authenticate(
  requiredScopes?: string[],
  requiredRoles?: string[]
) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse(res, "Unauthorized", null, 401);
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return errorResponse(res, "Unauthorized", null, 401);
      }
      const decoded = (await JwtUtil.verifyToken(token)) as {
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
      };
      req.user = omit(decoded, [
        "scope",
        "account",
        "globalRoles",
        "exp",
        "iat",
        "jti",
        "sub",
        "iss",
        "aud",
      ]);
      req.roles = decoded.account.find(
        (a) => a.service.toLowerCase() === "account"
      )?.roles;
      req.user = omit(decoded, [
        "scope",
        "account",
        "globalRoles",
        "exp",
        "iat",
        "jti",
        "sub",
        "iss",
        "aud",
      ]);

      if (requiredScopes) {
        const tokenScopes = decoded.scope;
        const hasRequiredScopes = requiredScopes.every((scope) => {
          const [service, resource, action] = scope.split(".");
          return (
            tokenScopes.includes(`${service}.${resource}.${action}`) ||
            tokenScopes.includes(`${service}.${resource}.manage`) ||
            tokenScopes.includes(`${service}.${resource}.*`)
          );
        });
        if (!hasRequiredScopes) {
          return errorResponse(res, "Unauthorized", null, 401);
        }
      }
      if (requiredRoles) {
        const hasRequiredRoles = requiredRoles.every((r) => {
          const [service, role] = r.split(".");
          const userRole = decoded.account.find(
            (a) => a.service.toLowerCase() === service
          )?.roles;
          return userRole?.some(
            (r) => r.nama.toUpperCase() === role.toUpperCase()
          );
        });
        if (!hasRequiredRoles) {
          return errorResponse(res, "Unauthorized", null, 401);
        }
      }
      next();
    } catch (e: unknown) {
      if (e instanceof JsonWebTokenError) {
        return errorResponse(res, e.message, null, 401);
      } else if (e instanceof TokenExpiredError) {
        return errorResponse(res, "Token expired", null, 401);
      } else {
        return errorResponse(
          res,
          "Internal Server Error",
          {
            message: "Unknown error",
          },
          500
        );
      }
    }
  };
}
