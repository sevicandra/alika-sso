import { Router } from "express";
import { z } from "zod";
import { ScopeActionControllerV1 } from "@/controllers/v1/scopeAction.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router();

const findQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  offset: z.string().regex(/^\d+$/, "Offset must be a number").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

const scopeActionCreateSchema = z.object({
  kode: z.string("Kode is required").regex(/^\d{3}$/, "Kode must be 3 digits number"),
  name: z.string("Name is required").min(1, "Name is required"),
  description: z.string("Description is required").min(1, "Description is required").optional(),
});

const scopeActionUpdateSchema = z.object({
  kode: z
    .string("Kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number")
    .optional(),
  name: z.string("Name is required").min(1, "Name is required").optional(),
  description: z.string("Description is required").min(1, "Description is required").optional(),
});

router.get(
  "/",
  authorizeScopes(["account.scopeaction.read"]),
  validateQuery(findQuerySchema),
  ScopeActionControllerV1.getAll
);
router.get("/:id", authorizeScopes(["account.scopeaction.read"]), ScopeActionControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["account.scopeaction.write"]),
  validateBody(scopeActionCreateSchema),
  ScopeActionControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["account.scopeaction.update"]),
  validateBody(scopeActionUpdateSchema),
  ScopeActionControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["account.scopeaction.delete"]),
  ScopeActionControllerV1.delete
);

export default router;
