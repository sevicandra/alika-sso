import { Router } from "express";
import {
  getAllScopes,
  getScopeById,
  createScope,
  updateScope,
  deleteScope,
} from "@/controllers/scope.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken(["account.scope.read"]), getAllScopes);
router.get("/:id", verifyToken(["account.scope.read"]), getScopeById);
router.post("/", verifyToken(["account.scope.write"]), createScope);
router.patch("/:id", verifyToken(["account.scope.update"]), updateScope);
router.delete("/:id", verifyToken(["account.scope.delete"]), deleteScope);

export default router;
