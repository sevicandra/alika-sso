import { Router } from "express";
import {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "@/controllers/v1/role.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate(["account.role.read"]), getAllRole);
router.get("/:id", authenticate(["account.role.read"]), getRoleById);
router.post("/", authenticate(["account.role.write"]), createRole);
router.patch("/:id", authenticate(["account.role.update"]), updateRole);
router.delete("/:id", authenticate(["account.role.delete"]), deleteRole);

export default router;
