import { Response, Router } from "express";
import { z } from "zod";
import { getAuthorizationCode } from "@/controllers/authorize.controller";
import { logout } from "@/controllers/logout.controller";
import { isAuthenticated } from "@/middlewares/auth.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { checkRequest } from "@/middlewares/authorize.middleware";
import { verifyClient } from "@/middlewares/token/verifyClient.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";
import { TokenRequest } from "@/types/auth";

const router = Router();

const getCodeSchema = z.object({
  client_id: z.string("Invalid client ID"),
  redirect_uri: z.url("Invalid redirect URI"),
  state: z.string().optional(),
  scope: z.string().regex(/^[a-zA-Z0-9._*\s]+$/, "Invalid scope format"),
  response_type: z.enum(["code"]),
});

const getTokenSchema = z.object({
  client_id: z.string("Invalid client ID").optional(),
  client_secret: z.string("Invalid client secret").optional(),
  grant_type: z.enum(["authorization_code", "refresh_token", "client_credentials"]),
  redirect_uri: z.url("Invalid redirect URI").optional(),
  code: z.string().optional(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
});

router.get(
  "/authorize",
  validateQuery(getCodeSchema),
  isAuthenticated,
  checkRequest,
  getAuthorizationCode
);
router.post(
  "/token",
  validateBody(getTokenSchema),
  verifyClient,
  (req: TokenRequest, res: Response) => {
    return res.status(200).json({
      access_token: req.access_token,
      refresh_token: req.refresh_token,
      expires_in: 60 * 5,
      scope: req.scope,
    });
  }
);

router.post("/signout", authenticate, logout);

export default router;
