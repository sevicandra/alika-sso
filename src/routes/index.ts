import { Request, Response, Router } from "express";
import { isAuthenticated } from "@/middlewares/auth.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { JwtUtil } from "@/utils/jwt.util";
import { appConfig } from "@/config/app.config";
import { errorResponse } from "@/helpers/respose.helper";
import Auth from "./Auth";
import Login from "./Login";
import Api from "./api";

const router = Router();

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
