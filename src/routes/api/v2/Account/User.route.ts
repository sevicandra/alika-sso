import { Router } from "express";
import {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllRole,
  addRole,
  removeRole,
} from "@/controllers/v2/account/user.controller";
const router = Router({ mergeParams: true });

router.get("/", getAllUser);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/role", getAllRole);
router.post("/:id/role", addRole);
router.delete("/:id/role/:role", removeRole)

export default router;
