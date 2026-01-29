import { Request, Response, NextFunction } from "express";
import { AuthenticationError, AuthorizationError } from "../utils/errors";
import { authService } from "@/services/auth-service";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError("Missing authorization header");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      throw new AuthenticationError("Invalid authorization header format");
    }
    const token = parts[1];
    req.token = token;
    const payload = await authService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeScopes = (requiredScopes?: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError("User not authenticated");
      }
      if (requiredScopes) {
        const tokenScopes = req.user.scope;
        const hasRequiredScopes = requiredScopes.every((scope) => {
          const [service, resource, action] = scope.split(".");
          return (
            tokenScopes?.includes(`${service}.${resource}.${action}`) ||
            tokenScopes?.includes(`${service}.${resource}.manage`) ||
            tokenScopes?.includes(`${service}.${resource}.*`)
          );
        });
        if (!hasRequiredScopes) {
          throw new AuthorizationError(
            `Access requires one of scopes: ${requiredScopes.join(", ")}`
          );
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authorizeRoles = (requiredRoles?: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError("User not authenticated");
      }
      if (requiredRoles) {
        const hasRequiredRoles = requiredRoles.every((r) => {
          const [service, role] = r.split(".");
          const userRole = req.user?.account?.find(
            (a) => a.service.toLowerCase() === service
          )?.roles;
          return userRole?.some((r) => r.nama.toUpperCase() === role.toUpperCase());
        });
        if (!hasRequiredRoles) {
          throw new AuthorizationError(`Access requires one of roles: ${requiredRoles.join(", ")}`);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
