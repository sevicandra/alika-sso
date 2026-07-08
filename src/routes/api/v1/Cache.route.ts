import { Router } from "express";
import { z } from "zod";
import { CacheController } from "@/controllers/v1/cache.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateParams, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router({ mergeParams: true });

const cacheQuerySchema = z.object({
  pattern: z.string().optional(),
});

const cacheParamsSchema = z.object({
  key: z.string().min(1, "Key is required"),
});

router.get(
  "/",
  authorizeScopes(["account.cache.read"]),
  validateQuery(cacheQuerySchema),
  CacheController.getKeys
);
router.get(
  "/:key",
  authorizeScopes(["account.cache.read"]),
  validateParams(cacheParamsSchema),
  CacheController.getKeyDetail
);
router.delete(
  "/:key",
  authorizeScopes(["account.cache.delete"]),
  validateParams(cacheParamsSchema),
  CacheController.deleteKey
);
router.delete(
  "/",
  authorizeScopes(["account.cache.delete"]),
  validateQuery(cacheQuerySchema),
  CacheController.clearCache
);

export default router;
