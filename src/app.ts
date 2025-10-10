import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import router from "./routes";
import logger from "morgan";
import session from "express-session";
import { appConfig } from "@/config/app.config";
import "./register-alias";
import SessionStore from "./utils/session.util";
import passport from "@/services/passport.service";
import methodOverride from "method-override";
import cron from "node-cron";
import { AuthorizationCode, RefreshToken, Session } from "./models";
import { Op } from "sequelize";

dotenv.config();
const sessionStore = new SessionStore();
const port = appConfig.PORT;
const publicPath = path.join(__dirname, "../public");
const app = express();

app.use(express.json());
app.use(logger("dev"));
app.set("trust proxy", 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(publicPath));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: appConfig.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.APP_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      path: "/",
    },
    unset: "destroy",
    name: `${process.env.APP_NAME || "SSO"}.session`,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(publicPath));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use("/", router);

app.listen(port, () => {
  console.log(`${appConfig.NAME} Server is up on port ${port}`);
});

cron.schedule("0 * * * *", async () => {
  console.log("Running cron job");
  
  await AuthorizationCode.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date(),
      },
    },
  });
  await RefreshToken.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date(),
      },
    },
  });

  await Session.destroy({
    where: {
      expires: {
        [Op.lt]: new Date(),
      },
    },
  });
  console.log("Cron job finished");
});

export default app;
