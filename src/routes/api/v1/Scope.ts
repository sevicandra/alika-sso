import { Router } from "express";
import { z } from "zod";
import { ScopeControllerV1 } from "@/controllers/v1/scope.controller";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

const findQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  offset: z.string().regex(/^\d+$/, "Offset must be a number").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

const roleCreateSchema = z.object({
  kode: z.string("Kode is required").regex(/^\d{3}$/, "Kode must be 3 digits number"),
  scope: z.string("Role is required").min(1, "Role is required"),
  service_kode: z
    .string("Service kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number"),
});

const roleUpdateSchema = z.object({
  kode: z
    .string("Kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number")
    .optional(),
  scope: z.string("Role is required").min(1, "Role is required").optional(),
  service_kode: z
    .string("Service kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number")
    .optional(),
});

const router = Router();

router.get(
  "/",
  authorizeScopes(["account.scope.read"]),
  validateQuery(findQuerySchema),
  ScopeControllerV1.getAll
);
router.get("/:id", authorizeScopes(["account.scope.read"]), ScopeControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["account.scope.write"]),
  validateBody(roleCreateSchema),
  ScopeControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["account.scope.update"]),
  validateBody(roleUpdateSchema),
  ScopeControllerV1.update
);
router.delete("/:id", authorizeScopes(["account.scope.delete"]), ScopeControllerV1.delete);

export default router;
