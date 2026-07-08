import { Router } from "express";
import { z } from "zod";
import { CacheController } from "@/controllers/v2/cache.controller";
import { validateParams, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router({ mergeParams: true });

const cacheQuerySchema = z.object({
  pattern: z.string().optional(),
});

const cacheParamsSchema = z.object({
  key: z.string().min(1, "Key is required"),
});

router.get("/", validateQuery(cacheQuerySchema), CacheController.getKeys);
router.get("/:key", validateParams(cacheParamsSchema), CacheController.getKeyDetail);
router.delete("/:key", validateParams(cacheParamsSchema), CacheController.deleteKey);
router.delete("/", validateQuery(cacheQuerySchema), CacheController.clearCache);

export default router;
