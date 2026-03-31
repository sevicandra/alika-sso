import { Router } from "express";
import { ServiceControllerV2 } from "@/controllers/v2/account/service.controller";
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
  kode: z.string("Kode is required"),
  name: z.string("Name is required"),
  description: z.string("Description is required"),
});

const updateSchema = z.object({
  kode: z.string("Kode is required").optional(),
  name: z.string("Name is required").optional(),
  description: z.string("Description is required").optional(),
});

const addRoleSchema = z.object({
  kode: z.string("Kode is required"),
  role: z.string("Role is required"),
  description: z.string("Description is required"),
});

const updateRoleSchema = z.object({
  kode: z.string("Kode is required").optional(),
  role: z.string("Role is required").optional(),
  description: z.string("Description is required").optional(),
});

const addScopeSchema = z.object({
  kode: z.string("Kode is required"),
  scope: z.string("Scope is required"),
});

const updateScopeSchema = z.object({
  kode: z.string("Kode is required").optional(),
  scope: z.string("Scope is required").optional(),
});

const addJabatanSchema = z.object({
  kode_satker: z
    .string("Kode Satker is required")
    .min(1, "Kode Satker is required")
    .regex(/^(\d{6}|-)$/, "Kode Satker must be 6 digits atau '-'"),
  kode_jabatan: z
    .string("Kode Jabatan is required")
    .min(1, "Kode Jabatan is required")
    .regex(/^\d{1,20}$/, "Kode Jabatan must be 20 digits or less"),
  kode_organisasi: z
    .string("Kode Organisasi is required")
    .min(1, "Kode Organisasi is required")
    .regex(/^\d{1,20}$/, "Kode Organisasi must be 20 digits or less"),
  description: z.string("Description is required").min(1, "Description is required"),
});

const updateJabatanSchema = z.object({
  kode_satker: z
    .string("Kode Satker is required")
    .min(1, "Kode Satker is required")
    .regex(/^(\d{6}|-)$/, "Kode Satker must be 6 digits atau '-'")
    .optional(),
  kode_jabatan: z
    .string("Kode Jabatan is required")
    .min(1, "Kode Jabatan is required")
    .regex(/^\d{1,20}$/, "Kode Jabatan must be 20 digits or less")
    .optional(),
  kode_organisasi: z
    .string("Kode Organisasi is required")
    .min(1, "Kode Organisasi is required")
    .regex(/^\d{1,20}$/, "Kode Organisasi must be 20 digits or less")
    .optional(),
  description: z.string("Description is required").min(1, "Description is required").optional(),
});

router.get("/", validateQuery(findQuerySchema), ServiceControllerV2.getAll);
router.get("/:ServiceKode", ServiceControllerV2.getById);
router.post("/", validateBody(createSchema), ServiceControllerV2.create);
router.patch("/:ServiceKode", validateBody(updateSchema), ServiceControllerV2.update);
router.delete("/:ServiceKode", ServiceControllerV2.delete);

router.get("/:ServiceKode/Role", validateQuery(findQuerySchema), ServiceControllerV2.getRoles);
router.get("/:ServiceKode/Role/:RoleKode", ServiceControllerV2.getRoleById);
router.post("/:ServiceKode/Role", validateBody(addRoleSchema), ServiceControllerV2.addRole);
router.patch(
  "/:ServiceKode/Role/:RoleKode",
  validateBody(updateRoleSchema),
  ServiceControllerV2.updateRole
);
router.delete("/:ServiceKode/Role/:RoleKode", ServiceControllerV2.removeRole);

router.get("/:ServiceKode/Scope", validateQuery(findQuerySchema), ServiceControllerV2.getScopes);
router.get("/:ServiceKode/Scope/:ScopeKode", ServiceControllerV2.getScopeById);
router.post("/:ServiceKode/Scope", validateBody(addScopeSchema), ServiceControllerV2.addScope);
router.patch(
  "/:ServiceKode/Scope/:ScopeKode",
  validateBody(updateScopeSchema),
  ServiceControllerV2.updateScope
);
router.delete("/:ServiceKode/Scope/:ScopeKode", ServiceControllerV2.removeScope);

router.get("/:ServiceKode/Jabatan", validateQuery(findQuerySchema), ServiceControllerV2.getJabatan);
router.get("/:ServiceKode/Jabatan/:Id", ServiceControllerV2.getJabatanById);
router.post(
  "/:ServiceKode/Jabatan",
  validateBody(addJabatanSchema),
  ServiceControllerV2.addJabatan
);
router.patch(
  "/:ServiceKode/Jabatan/:Id",
  validateBody(updateJabatanSchema),
  ServiceControllerV2.updateJabatan
);
router.delete("/:ServiceKode/Jabatan/:Id", ServiceControllerV2.removeJabatan);

export default router;
