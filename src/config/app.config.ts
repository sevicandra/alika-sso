import dotenv from "dotenv";
import fs from "fs";
import { z } from "zod";
import ms from "ms";
dotenv.config();

interface appConfigInterface {
  NAME: string;
  ENV: "development" | "production" | "test";
  URL: string;
  PORT: number;
  VERSION: string;
  TIMEZONE: string;
  LOCALE: string;
  SESSION_SECRET: string;
  SESSION_EXPIRES_IN: ms.StringValue;
  LEVEL_LOG: string;
}

const isMsFormat = (value: string): boolean => {
  if (typeof value !== "string") return false;

  // Gunakan ms library untuk parse
  const result = ms(value as ms.StringValue);

  // Jika ms berhasil parse dan return number, maka valid
  // ms mengembalikan undefined jika format invalid
  return typeof result === "number" && result > 0;
};

const envSchema = z.object({
  NAME: z.string().min(1).default("alika"),
  ENV: z.enum(["development", "production", "test"]).default("development"),
  URL: z.string().min(1),
  PORT: z.number().min(1).max(65535).default(3000),
  VERSION: z.string().min(1).default("1.0.0"),
  TIMEZONE: z.string().min(1).default("Asia/Jakarta"),
  LOCALE: z.string().min(1).default("id"),
  SESSION_SECRET: z.string().min(32, "JWT_SECRET harus minimal 32 karakter"),
  SESSION_EXPIRES_IN: z
    .string()
    .min(1, "JWT_EXPIRES_IN tidak boleh kosong")
    .refine(isMsFormat, {
      message:
        'JWT_EXPIRES_IN harus format ms (contoh: "7d", "24h", "30m", "3600s")',
    })
    .transform((value) => value as ms.StringValue),
  LEVEL_LOG: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),
});

let config: appConfigInterface;
try {
  config = envSchema.parse({
    NAME: process.env.APP_NAME,
    ENV: process.env.NODE_ENV,
    URL: process.env.APP_URL,
    PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
    VERSION: process.env.VERSION,
    TIMEZONE: process.env.TIMEZONE,
    LOCALE: process.env.LOCALE,
    SESSION_SECRET: process.env.SESSION_SECRET_FILE
      ? fs.readFileSync(process.env.SESSION_SECRET_FILE, "utf8").trim()
      : process.env.SESSION_SECRET,
    SESSION_EXPIRES_IN: process.env.SESSION_EXPIRES_IN,
    LEVEL_LOG: process.env.LEVEL_LOG,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Environment configuration error:");
    error.issues.forEach((err) => {
      console.error(`  - ${err.path}: ${err.message}`);
    });
  }
  process.exit(1);
}

const appConfig = config;

export { appConfig };
