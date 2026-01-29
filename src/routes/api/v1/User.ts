import { Router } from "express";
import { UserControllerV1 } from "@/controllers/v1/user.controller";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";
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
  nip: z
    .string("NIP is required")
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "NIP must be 18 digits"
    ),
  nama: z.string("Nama is required"),
});

const updateSchema = z.object({
  nip: z
    .string("NIP is required")
    .regex(
      /^(19[6-9]\d|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(19[8-9]\d|20\d{2})(0[1-9]|1[0-2])([1-2])(\d{3})$/,
      "NIP must be 18 digits"
    )
    .optional(),
  nama: z.string("Nama is required").min(3, "Nama must be at least 3 characters long").optional(),
});

const addRoleSchema = z.object({
  role: z.string("Role is required"),
});

router.get("/", validateQuery(findQuerySchema), UserControllerV1.getAll);
router.get("/:UserId", UserControllerV1.getById);
router.post("/", validateBody(createSchema), UserControllerV1.create);
router.patch("/:UserId", validateBody(updateSchema), UserControllerV1.update);
router.delete("/:UserId", UserControllerV1.delete);
router.get("/:UserId/role", UserControllerV1.getRoles);
router.post("/:UserId/role", validateBody(addRoleSchema), UserControllerV1.addRole);
router.delete("/:UserId/role/:role", UserControllerV1.removeRole);

export default router;
