import { Router } from "express";
import {
  getAllScopeActions,
  getScopeActionById,
  createScopeAction,
  updateScopeAction,
  deleteScopeAction,
} from "@/controllers/scopeAction.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken(["account.scopeaction.read"]), getAllScopeActions);
router.get("/:id", verifyToken(["account.scopeaction.read"]), getScopeActionById);
router.post("/", verifyToken(["account.scopeaction.write"]), createScopeAction);
router.patch("/:id", verifyToken(["account.scopeaction.update"]), updateScopeAction);
router.delete("/:id", verifyToken(["account.scopeaction.delete"]), deleteScopeAction);

export default router;
