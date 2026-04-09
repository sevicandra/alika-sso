import { NextFunction, Request, Response } from "express";
import { appConfig } from "@/config/app.config";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect(appConfig.URL + "/login?ReturnUrl=" + encodeURIComponent(req.originalUrl));
  }
};
