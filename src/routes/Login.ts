import { Router, Request, Response } from "express";
import passport from "@/services/passport.service";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.render("auth/login");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: `${process.env.APP_HOST}login`,
  }),
  (req: Request, res: Response) => {
    req.user = req.user as Express.User;
    return res.redirect((req.query.ReturnUrl as string) || "/");
  }
);

router.post("/KemenkeuID", passport.authenticate("oauth2"));
router.get(
  "/Callback",
  passport.authenticate("oauth2", {
    failureRedirect: `${process.env.APP_HOST}login`,
  }),
  (req: Request, res: Response) => {
    return res.redirect("/api/auth/signin");
  }
);

export default router;
