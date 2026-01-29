import { Router, Request, Response } from "express";
import Login from "./Login";
import Auth from "./Auth";
import Api from "./api";
import { JwtUtil } from "@/utils/jwt.util";
import { errorResponse } from "@/helpers/respose.helper";
import { isAuthenticated } from "@/middlewares/auth.middleware";
import { appConfig } from "@/config/app.config";
const router = Router();
import { authenticate } from "@/middlewares/authenticate.middleware";

router.get("/", isAuthenticated, (_req: Request, res: Response) => {
  return res.render("index", {
    url: appConfig.URL,
  });
});
router.use("/login", Login);
router.use("/auth", Auth);
router.use("/api", authenticate, Api);
router.get("/.well-known/jwks.json", async (_req: Request, res: Response) => {
  try {
    const jwks = await JwtUtil.getJWKS();
    return res.json(jwks);
  } catch (error) {
    return errorResponse(res, "Error generating JWKS", error, 500);
  }
});
export default router;
