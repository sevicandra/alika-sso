import { Router } from "express";
import {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "@/controllers/v2/account/service/role.controller";
const router = Router({ mergeParams: true });

router.get("/", getAllRole);
router.get("/:RoleKode", getRoleById);
router.post("/", createRole);
router.patch("/:RoleKode", updateRole);
router.delete("/:RoleKode", deleteRole);

export default router;
