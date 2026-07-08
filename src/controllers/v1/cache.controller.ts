import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { redisService } from "@/services/redis-service";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";

export const CacheController = {
  getKeys: asyncHandler(async (req: Request, res: Response) => {
    const pattern = (req.query.pattern as string) || "*";
    const keys = await redisService.getKeys(pattern);

    // Group/segment keys based on the current level of the wildcard pattern (number of colons)
    const wildcardIndex = pattern.indexOf("*");
    const prefixPart = wildcardIndex !== -1 ? pattern.substring(0, wildcardIndex) : pattern;
    const colonCount = (prefixPart.match(/:/g) || []).length;

    const segmentMap = new Map<
      string,
      {
        name: string;
        hasSubPattern: boolean;
        fullKey?: string;
        nextPattern?: string;
      }
    >();

    for (const key of keys) {
      const segments = key.split(":");
      const segmentName = segments[colonCount] || segments[segments.length - 1] || key;
      const isLeaf = segments.length <= colonCount + 1;

      let item = segmentMap.get(segmentName);
      if (!item) {
        item = {
          name: segmentName,
          hasSubPattern: false,
        };
        segmentMap.set(segmentName, item);
      }

      if (!isLeaf) {
        item.hasSubPattern = true;
        item.nextPattern = `${prefixPart}${segmentName}:*`;
        delete item.fullKey;
      } else {
        if (!item.hasSubPattern) {
          item.fullKey = key;
        }
      }
    }

    const processedKeys = Array.from(segmentMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    successResponse(res, "Success get cache keys", {
      pattern,
      count: keys.length,
      keys: processedKeys,
    });
  }),

  getKeyDetail: asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;

    if (typeof key !== "string" || !key) {
      throw new InvalidRequestError("Key is required");
    }

    const ttl = await redisService.getTtl(key);
    if (ttl === -2) {
      throw new NotFoundError(`Cache key '${key}' not found`);
    }

    const value = await redisService.get<any>(key);

    successResponse(res, "Success get cache key detail", {
      key,
      ttl: ttl === -1 ? "Persistent" : ttl, // -1 means no expiration
      value,
    });
  }),

  deleteKey: asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;

    if (typeof key !== "string" || !key) {
      throw new InvalidRequestError("Key is required");
    }

    const ttl = await redisService.getTtl(key);
    if (ttl === -2) {
      throw new NotFoundError(`Cache key '${key}' not found`);
    }

    await redisService.del(key);

    successResponse(res, `Success delete cache key '${key}'`);
  }),

  clearCache: asyncHandler(async (req: Request, res: Response) => {
    const pattern = (req.query.pattern as string) || "*";
    const deletedCount = await redisService.deletePattern(pattern);

    successResponse(res, `Success clear cache with pattern '${pattern}'`, {
      pattern,
      deletedCount,
    });
  }),
};
