import { Router } from "express";
import { JabatanServiceControllerV1 } from "@/controllers/v1/jabatanService.controller";
import {
  validateBody,
  validateQuery,
  validateCsvMiddleware,
} from "@/middlewares/validate-request.middleware";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";
import { z } from "zod";
import { uploadCsvMemory } from "@/middlewares/multer.middleware";

const findQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  offset: z.string().regex(/^\d+$/, "Offset must be a number").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

const jabatanCreateSchema = z.object({
  service_kode: z
    .string("Service kode is required")
    .regex(/^\d{3}$/, "Kode must be 3 digits number"),
  kode_satker: z
    .string("Kode Satker is required")
    .min(1, "Kode Satker is required")
    .regex(/^\d{6}$/, "Kode Satker must be 6 digits"),
  kode_jabatan: z
    .string("Kode Jabatan is required")
    .min(1, "Kode Jabatan is required")
    .regex(/^\d{1,20}$/, "Kode Satker must be 20 digits or less"),
  kode_organisasi: z
    .string("Kode Organisasi is required")
    .min(1, "Kode Organisasi is required")
    .regex(/^\d{1,20}$/, "Kode Organisasi must be 20 digits or less"),
  description: z.string("Description is required").min(1, "Description is required"),
});

const jabatanUpdateSchema = jabatanCreateSchema.partial();

const router = Router();

router.get(
  "/",
  authorizeScopes(["account.jabatan.read"]),
  validateQuery(findQuerySchema),
  JabatanServiceControllerV1.getAll
);
router.get("/:id", authorizeScopes(["account.jabatan.read"]), JabatanServiceControllerV1.getById);
router.post(
  "/",
  authorizeScopes(["account.jabatan.write"]),
  validateBody(jabatanCreateSchema),
  JabatanServiceControllerV1.create
);
router.post(
  "/Import",
  authorizeScopes(["account.jabatan.write"]),
  uploadCsvMemory,
  validateCsvMiddleware(jabatanCreateSchema),
  JabatanServiceControllerV1.import
);
router.patch(
  "/:id",
  authorizeScopes(["account.jabatan.update"]),
  validateBody(jabatanUpdateSchema),
  JabatanServiceControllerV1.update
);
router.delete(
  "/:id",
  authorizeScopes(["account.jabatan.delete"]),
  JabatanServiceControllerV1.delete
);

export default router;
