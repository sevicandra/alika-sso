import { Router } from "express";
import { ScopeActionControllerV2 } from "@/controllers/v2/account/scopeAction.controller";
import {
  validateBody,
  validateQuery,
} from "@/middlewares/validate-request.middleware";
import { z } from "zod";
const router = Router({ mergeParams: true });

const findQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  offset: z.string().regex(/^\d+$/, "Offset must be a number").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

const createSchema = z.object({
  kode: z.string("Kode is required"),
  name: z.string("Name is required"),
  description: z.string("Description is required"),
});

const updateSchema = z.object({
  kode: z.string("Kode is required").optional(),
  name: z.string("Name is required").optional(),
  description: z.string("Description is required").optional(),
});

router.get("/", validateQuery(findQuerySchema), ScopeActionControllerV2.getAll);
router.get("/:ScopeActionId", ScopeActionControllerV2.getById);
router.post("/", validateBody(createSchema), ScopeActionControllerV2.create);
router.patch(
  "/:ScopeActionId",
  validateBody(updateSchema),
  ScopeActionControllerV2.update
);
router.delete("/:ScopeActionId", ScopeActionControllerV2.delete);

export default router;
