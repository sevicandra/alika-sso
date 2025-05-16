import { Router } from "express";
import {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "@/controllers/role.controller";
import { verifyToken } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken(["account.role.read"]), getAllRole);
router.get("/:id", verifyToken(["account.role.read"]), getRoleById);
router.post("/", verifyToken(["account.role.write"]), createRole);
router.patch("/:id", verifyToken(["account.role.update"]), updateRole);
router.delete("/:id", verifyToken(["account.role.delete"]), deleteRole);

export default router;
