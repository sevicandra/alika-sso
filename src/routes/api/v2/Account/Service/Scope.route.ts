import { Router } from "express";
import {
  getAllScope,
  getScopeById,
  createScope,
  updateScope,
  deleteScope,
} from "@/controllers/v2/account/service/scope.controller";
const router = Router({ mergeParams: true });

router.get("/", getAllScope);
router.get("/:ScopeKode", getScopeById);
router.post("/", createScope);
router.patch("/:ScopeKode", updateScope);
router.delete("/:ScopeKode", deleteScope);

export default router;
