import { Router, Request, Response, NextFunction } from "express";
import passport from "@/services/passport.service";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.render("auth/login");
});

router.post(
  "/",
  passport.authenticate("local", { failureRedirect: `${process.env.APP_HOST}login` }),
  (req: Request, res: Response, next: NextFunction) => {
    req.user = req.user as Express.User;
    res.redirect((req.query.ReturnUrl as string) || "/");
  }
);

router.post("/KemenkeuID", passport.authenticate("oauth2"));
router.get(
  "/Callback",
  passport.authenticate("oauth2", { failureRedirect: `${process.env.APP_HOST}login` }),
  (req: Request, res: Response, next: NextFunction) => {
    res.redirect((req.query.ReturnUrl as string) || "/");
  }
);

export default router;