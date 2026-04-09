import winston from "winston";
import Transport from "winston-transport";
import { minioService } from "@/services/minio-service";
import { appConfig } from "@/config/app.config";

class MinioTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
    this.level = appConfig.LEVEL_LOG;
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const date = new Date();
    const fileName = `log/log-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.log`;
    const logEntry = `${JSON.stringify(info)}\n`;

    try {
      let existingContent = Buffer.from("");
      try {
        const fileBuffer = await minioService.getFile(fileName);
        if (fileBuffer) {
          existingContent = Buffer.from(fileBuffer);
        }
      } catch (error: any) {
        if (error.message === "Failed to get file: The specified key does not exist.") {
          // File doesn't exist, proceed to create a new one
        } else {
          throw error;
        }
      }

      const newContent = Buffer.concat([existingContent, Buffer.from(logEntry)]);
      await minioService.uploadFile(newContent, fileName, "text/plain");
    } catch (error) {
      console.error("Error uploading log to MinIO:", error);
    }

    callback();
  }
}

const logger = winston.createLogger({
  level: appConfig.LEVEL_LOG,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new MinioTransport({ level: appConfig.LEVEL_LOG }),
  ],
});

export default logger;
