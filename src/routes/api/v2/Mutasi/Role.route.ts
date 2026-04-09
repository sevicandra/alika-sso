import { Router } from "express";
import { z } from "zod";
import { RoleControllerV2 } from "@/controllers/v2/mutasi/role.controller";
import { validateQuery } from "@/middlewares/validate-request.middleware";

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

router.get("/", validateQuery(findQuerySchema), RoleControllerV2.getAll);

export default router;
