import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserRole,
  addUserRole,
} from "@/controllers/user.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken(["account.user.read"]), getAllUsers);
router.get("/:id", verifyToken(["account.user.read"]), getUserById);
router.post("/", verifyToken(["account.user.write"]), createUser);
router.patch("/:id", verifyToken(["account.user.update"]), updateUser);
router.delete("/:id", verifyToken(["account.user.delete"]), deleteUser);
router.get("/:id/roles", verifyToken(["account.user.read"]), getUserRole);
router.post("/:id/roles", verifyToken(["account.user.write"]), addUserRole);

export default router;
