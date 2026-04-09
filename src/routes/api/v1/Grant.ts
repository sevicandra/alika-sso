import { Router } from "express";
import { z } from "zod";
import { GrantControllerV1 } from "@/controllers/v1/grant.controller";
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

const grantCreateSchema = z.object({
  grant: z.string("Grant is required").min(1, "Grant is required"),
  kode: z.string("Kode is required").regex(/^\d{3}$/, "Kode must be 3 digits number"),
});

const grantUpdateSchema = z.object({
  grant: z.string("Grant is required").min(1, "Grant is required").optional(),
  kode: z
    .string("Kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number")
    .optional(),
});

router.get(
  "/",
  authorizeScopes(["account.grant.read"]),
  validateQuery(findQuerySchema),
  GrantControllerV1.getAll
);
router.get("/:id", authorizeScopes(["account.grant.read"]), GrantControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["account.grant.write"]),
  validateBody(grantCreateSchema),
  GrantControllerV1.create
);
router.patch(
  "/:id",
  authorizeScopes(["account.grant.update"]),
  validateBody(grantUpdateSchema),
  GrantControllerV1.update
);
router.delete("/:id", authorizeScopes(["account.grant.delete"]), GrantControllerV1.delete);

export default router;
