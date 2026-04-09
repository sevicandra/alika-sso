import { Router } from "express";
import { z } from "zod";
import { GrantControllerV2 } from "@/controllers/v2/account/grant.controller";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

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

const grantCreateSchema = z.object({
  kode: z.string("Kode is required"),
  grant: z.string("Grant is required"),
});

const grantUpdateSchema = z.object({
  kode: z.string("Kode is required").optional(),
  grant: z.string("Grant is required").optional(),
});

router.get("/", validateQuery(findQuerySchema), GrantControllerV2.getAll);
router.get("/:GrantId", GrantControllerV2.getById);
router.post("/", validateBody(grantCreateSchema), GrantControllerV2.create);
router.patch("/:GrantId", validateBody(grantUpdateSchema), GrantControllerV2.update);
router.delete("/:GrantId", GrantControllerV2.delete);

export default router;
