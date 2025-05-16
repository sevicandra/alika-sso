import { Router, Request, Response, NextFunction } from "express";
import { isAuthenticated } from "@/middlewares/auth.middleware";
import { checkRequest } from "@/middlewares/authorize.middleware";
import { authorizationCode } from "@/controllers/authorize.controller";
import { verifyClient } from "@/middlewares/token/verifyClient.middleware";
import { TokenRequest } from "@/types/auth";
const router = Router();

router.get("/authorize", isAuthenticated, checkRequest, authorizationCode);
router.post(
  "/token",
  verifyClient,
  (req: TokenRequest, res: Response, next: NextFunction) => {
    return res.status(200).json( {
      access_token: req.access_token,
      refresh_token: req.refresh_token,
      expires_in: 3600,
      scope: req.scope,
    })
  }
);


export default router;
