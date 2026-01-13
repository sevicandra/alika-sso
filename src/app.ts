import "./register-alias";
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import router from "./routes";
import morgan from "morgan";
import logger from "./utils/Logger.utils";
import session from "express-session";
import { appConfig } from "@/config/app.config";
import SessionStore from "./utils/session.util";
import passport from "@/services/passport.service";
import methodOverride from "method-override";
import cron from "node-cron";
import { AuthorizationCode, RefreshToken, Session } from "./repositories";
import { Op } from "sequelize";
import { redisService } from "@/services/redis-service";
import { correlationIdMiddleware } from "@/middlewares/correlation-id.middleware";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error-handler.middleware";
import { JwtUtil } from "@/utils/jwt.util";
import ms from "ms";


const startServer = async () => {
  try {
    await JwtUtil.initialize();
    await redisService.connect();

    dotenv.config();
    const sessionStore = new SessionStore();
    const port = appConfig.PORT;
    const publicPath = path.join(__dirname, "../public");
    const app = express();

    app.use(correlationIdMiddleware);

    app.use((req: Request, res: Response, next: NextFunction) => {
      req.id = Math.random().toString(36).substr(2, 9);
      res.setHeader("X-Request-ID", req.id);
      next();
    });
    app.use(
      morgan(":method :url :status :response-time ms", {
        stream: {
          write: (message) => {
            logger.http(message.trim());
          },
        },
      })
    );

    app.use(express.json());
    app.set("trust proxy", 1);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(publicPath));
    app.use(methodOverride("_method"));
    app.use(
      session({
        secret: appConfig.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
          secure: appConfig.ENV === "production",
          sameSite: "lax",
          maxAge: ms(appConfig.SESSION_EXPIRES_IN),
          httpOnly: true,
          path: "/",
        },
        unset: "destroy",
        name: `${process.env.APP_NAME || "SSO"}.session`,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.set("views", path.join(__dirname, "./views"));
    app.set("view engine", "ejs");

    app.use("/", router);
    app.use(notFoundHandler);
    app.use(errorHandler);

    const server = app.listen(port, () => {
      logger.info(`Server started on port ${port}`);
    });

    cron.schedule("0 * * * *", async () => {
      try {
        const startTime = Date.now();

        logger.info("Starting cleanup cron job");

        const authCodeCount = await AuthorizationCode.delete({
          where: { expiresAt: { [Op.lt]: new Date() } },
        });

        const refreshTokenCount = await RefreshToken.delete({
          where: { expiresAt: { [Op.lt]: new Date() } },
        });

        const sessionCount = await Session.delete({
          where: { expires: { [Op.lt]: new Date() } },
        });

        logger.info("Cleanup cron job completed", {
          authCodeDeleted: authCodeCount,
          refreshTokenDeleted: refreshTokenCount,
          sessionDeleted: sessionCount,
          durationMs: Date.now() - startTime,
        });
      } catch (error) {
        logger.error("Cron job failed", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

startServer();
