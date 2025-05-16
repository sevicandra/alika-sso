import { Router, Request, Response } from "express";
import Login from "./Login";
import Auth from "./Auth";
import Api from "./api";
import { JwtUtil } from "@/utils/jwt.util";
import { errorResponse } from "@/helpers/respose.helper";

const router = Router();

router.use("/login", Login);
router.use("/auth", Auth);
router.use("/api", Api);
router.get("/.well-known/jwks.json", async (req: Request, res: Response) => {
  try {
    const jwks = await JwtUtil.getJWKS();
    return res.json(jwks);
  } catch (error) {
    return errorResponse(res, "Error generating JWKS", error, 500);
  }
});
export default router;
