import { Router, Request, Response } from "express";
import passport from "@/services/passport.service";
import { appConfig } from "@/config/app.config";
import lusca from "lusca";

const router = Router();

router.use(lusca.csrf());

router.get("/", (req: Request, res: Response) => {
  return res.render("auth/login", {
    url: appConfig.URL,
    csrfToken: res.locals._csrf,
  });
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
    failureRedirect: `${appConfig.URL}/login`,
  }),
  (req: Request, res: Response) => {
    const searchParams = new URLSearchParams();
    if (req.query.ReturnUrl)
      searchParams.append("ReturnUrl", req.query.ReturnUrl as string);
    return res.redirect(`${appConfig.URL}?${searchParams.toString()}`);
  }
);

export default router;
