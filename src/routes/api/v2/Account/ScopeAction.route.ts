import { Router } from "express";
import {
  getAllScopeAction,
  getScopeActionById,
  createScopeAction,
  updateScopeAction,
  deleteScopeAction,
} from "@/controllers/v2/account/scopeAction.controller";
const router = Router({ mergeParams: true });

router.get("/", getAllScopeAction)
router.get("/:id", getScopeActionById)
router.post("/", createScopeAction)
router.patch("/:id", updateScopeAction)
router.delete("/:id", deleteScopeAction)

export default router;