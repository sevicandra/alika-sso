import { Router, Response } from "express";
import { isAuthenticated } from "@/middlewares/auth.middleware";
import { checkRequest } from "@/middlewares/authorize.middleware";
import { authorizationCode } from "@/controllers/authorize.controller";
import { verifyClient } from "@/middlewares/token/verifyClient.middleware";
import { TokenRequest } from "@/types/auth";
import { verifyToken } from "@/middlewares/auth.middleware";
import { logout } from "@/controllers/logout.controller";
const router = Router();

router.get("/authorize", isAuthenticated, checkRequest, authorizationCode);
router.post("/token", verifyClient, (req: TokenRequest, res: Response) => {
  return res.status(200).json({
    access_token: req.access_token,
    refresh_token: req.refresh_token,
    expires_in: 60 * 5,
    scope: req.scope,
  });
});

router.post("/signout", verifyToken(), logout);

export default router;
