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
import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", authenticate(["account.user.read"]), getAllUsers);
router.get("/:id", authenticate(["account.user.read"]), getUserById);
router.post("/", authenticate(["account.user.write"]), createUser);
router.patch("/:id", authenticate(["account.user.update"]), updateUser);
router.delete("/:id", authenticate(["account.user.delete"]), deleteUser);
router.get("/:id/roles", authenticate(["account.user.read"]), getUserRole);
router.post("/:id/roles", authenticate(["account.user.write"]), addUserRole);

export default router;
