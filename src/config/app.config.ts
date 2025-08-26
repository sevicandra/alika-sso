import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  NAME: process.env.APP_NAME || "alika",
  ENV: process.env.NODE_ENV || "development",
  URL: process.env.APP_URL || "http://localhost:3000",
  PORT: process.env.APP_PORT || 3000,
  VERSION: process.env.APP_VERSION || "1.0.0",
  TIMEZONE: process.env.APP_TIMEZONE || "Asia/Jakarta",
  LOCALE: process.env.APP_LOCALE || "id",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  LEVEL_LOG: process.env.APP_LEVEL_LOG || "info",
};
