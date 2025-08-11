import { Router } from "express";
import {
  getAllScopeActions,
  getScopeActionById,
  createScopeAction,
  updateScopeAction,
  deleteScopeAction,
} from "@/controllers/scopeAction.controller";
import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", authenticate(["account.scopeaction.read"]), getAllScopeActions);
router.get("/:id", authenticate(["account.scopeaction.read"]), getScopeActionById);
router.post("/", authenticate(["account.scopeaction.write"]), createScopeAction);
router.patch("/:id", authenticate(["account.scopeaction.update"]), updateScopeAction);
router.delete("/:id", authenticate(["account.scopeaction.delete"]), deleteScopeAction);

export default router;
