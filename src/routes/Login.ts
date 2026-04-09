import { NextFunction, Request, Response, Router } from "express";
import lusca from "lusca";
import passport from "@/services/passport.service";
import { appConfig } from "@/config/app.config";

const router = Router();

router.use(lusca.csrf());

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.message && err.message.toLowerCase().includes("csrf token")) {
    const searchParams = new URLSearchParams();
    if (req.query.ReturnUrl) {
      searchParams.append("ReturnUrl", req.query.ReturnUrl as string);
    }
    searchParams.append(
      "error",
      "Sesi anda telah berakhir atau tidak valid, silakan login kembali."
    );
    return res.redirect(`${appConfig.URL}/login?${searchParams.toString()}`);
  }
  next(err);
});
router.get("/", (_req: Request, res: Response) => {
  return res.render("auth/login", {
    url: appConfig.URL,
    csrfToken: res.locals._csrf,
  });
});

router.post("/KemenkeuID", passport.authenticate("oauth2"));
router.get("/Callback", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("oauth2", (err: any, user: any, _info: any) => {
    // Custom callback to handle OAuth errors gracefully
    if (err) {
      const errorMessage = err.message || "Authentication failed during OAuth callback";
      const searchParams = new URLSearchParams();
      if (req.query.ReturnUrl) searchParams.append("ReturnUrl", req.query.ReturnUrl as string);
      searchParams.append("error", errorMessage);
      return res.redirect(`${appConfig.URL}/login?${searchParams.toString()}`);
    }

    if (!user) {
      const searchParams = new URLSearchParams();
      if (req.query.ReturnUrl) searchParams.append("ReturnUrl", req.query.ReturnUrl as string);
      searchParams.append("error", "User not found or authentication failed");
      return res.redirect(`${appConfig.URL}/login?${searchParams.toString()}`);
    }

    // Explicitly login the user into the session
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        const searchParams = new URLSearchParams();
        if (req.query.ReturnUrl) searchParams.append("ReturnUrl", req.query.ReturnUrl as string);
        searchParams.append("error", loginErr.message || "Failed to establish session");
        return res.redirect(`${appConfig.URL}/login?${searchParams.toString()}`);
      }

      // Success redirect
      const searchParams = new URLSearchParams();
      if (req.query.ReturnUrl) searchParams.append("ReturnUrl", req.query.ReturnUrl as string);
      return res.redirect(`${appConfig.URL}?${searchParams.toString()}`);
    });
  })(req, res, next);
});

export default router;
