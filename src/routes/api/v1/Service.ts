import { Router } from "express";
import { ServiceControllerV1 } from "@/controllers/v1/service.controller";
import {
  validateBody,
  validateQuery,
} from "@/middlewares/validate-request.middleware";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { z } from "zod";
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

const serviceCreateSchema = z.object({
  kode: z
    .string("Kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number"),
  name: z.string("Name is required").min(1, "Name is required"),
  description: z
    .string("Description is required")
    .min(1, "Description is required")
    .optional(),
});

const serviceUpdateScema = z.object({
  kode: z
    .string("Kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number")
    .optional(),
  name: z.string("Name is required").min(1, "Name is required").optional(),
  description: z
    .string("Description is required")
    .min(1, "Description is required")
    .optional(),
});

const addRoleSchema = z.object({
  role: z.string("Role is required").min(1, "Role is required"),
  kode: z
    .string("Kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number"),
  description: z.string("Description is required").optional(),
});

const addScopeSchema = z.object({
  scope: z.string("Scope is required").min(1, "Scope is required"),
  kode: z
    .string("Kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number"),
});

router.get(
  "/",
  authorizeScopes(["account.service.read"]),
  validateQuery(findQuerySchema),
  ServiceControllerV1.getAll
);
router.get(
  "/:id",
  authorizeScopes(["account.service.read"]),
  ServiceControllerV1.getById
);
router.get(
  "/:id/roles",
  authorizeScopes(["account.service.read"]),
  ServiceControllerV1.getRoles
);
router.get(
  "/:id/scopes",
  authorizeScopes(["account.service.read"]),
  ServiceControllerV1.getScopes
);

router.post(
  "/",
  authorizeScopes(["account.service.write"]),
  validateBody(serviceCreateSchema),
  ServiceControllerV1.create
);
router.post(
  "/:id/roles",
  authorizeScopes(["account.service.write", "account.role.write"]),
  validateBody(addRoleSchema),
  ServiceControllerV1.addRole
);
router.post(
  "/:id/scopes",
  authorizeScopes(["account.service.write", "account.scope.write"]),
  validateBody(addScopeSchema),
  ServiceControllerV1.addScope
);

router.patch(
  "/:id",
  authorizeScopes(["account.service.update"]),
  validateBody(serviceUpdateScema),
  ServiceControllerV1.update
);

router.delete(
  "/:id",
  authorizeScopes(["account.service.delete"]),
  ServiceControllerV1.delete
);
router.delete(
  "/:id/roles/:roleId",
  authorizeScopes(["account.service.delete", "account.role.delete"]),
  ServiceControllerV1.deleteRole
);
router.delete(
  "/:id/scopes/:scopeId",
  authorizeScopes(["account.service.delete", "account.scope.delete"]),
  ServiceControllerV1.deleteScope
);

export default router;
