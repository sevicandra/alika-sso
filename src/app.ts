import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import methodOverride from "method-override";
import morgan from "morgan";
import ms from "ms";
import cron from "node-cron";
import path from "path";
import { Op } from "sequelize";
import { correlationIdMiddleware } from "@/middlewares/correlation-id.middleware";
import { minioService } from "@/services/minio-service";
import passport from "@/services/passport.service";
import { redisService } from "@/services/redis-service";
import { JwtUtil } from "@/utils/jwt.util";
import { appConfig } from "@/config/app.config";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.middleware";
import { sequelize } from "./models";
import "./register-alias";
import { AuthorizationCode, RefreshToken, Session } from "./repositories";
import router from "./routes";
import logger from "./utils/Logger.utils";
import SessionStore from "./utils/session.util";

const startServer = async () => {
  try {
    await JwtUtil.initialize();
    await redisService.connect();
    await minioService.ensureBucketExists();
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

    app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({ status: "OK", timestamp: new Date() });
    });

    app.use("/", router);
    app.use(notFoundHandler);
    app.use(errorHandler);

    const server = app.listen(port, () => {
      logger.info(`Server started on port ${port}`);
    });

    cron.schedule("0 * * * *", async () => {
      const t = await sequelize.transaction();
      try {
        const startTime = Date.now();

        logger.info("Starting cleanup cron job");

        const authCodeCount = await AuthorizationCode.deleteOne(
          {
            where: { expiresAt: { [Op.lt]: new Date() } },
          },
          t
        );

        const refreshTokenCount = await RefreshToken.deleteOne(
          {
            where: { expiresAt: { [Op.lt]: new Date() } },
          },
          t
        );

        const sessionCount = await Session.deleteOne(
          {
            where: { expires: { [Op.lt]: new Date() } },
          },
          t
        );

        logger.info("Cleanup cron job completed", {
          authCodeDeleted: authCodeCount,
          refreshTokenDeleted: refreshTokenCount,
          sessionDeleted: sessionCount,
          durationMs: Date.now() - startTime,
        });
        await t.commit();
      } catch (error) {
        logger.error("Cron job failed", {
          error: error instanceof Error ? error.message : String(error),
        });
        await t.rollback();
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
