import { Router } from "express";
import {
  getAllScopes,
  getScopeById,
  createScope,
  updateScope,
  deleteScope,
} from "@/controllers/scope.controller";
import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", authenticate(["account.scope.read"]), getAllScopes);
router.get("/:id", authenticate(["account.scope.read"]), getScopeById);
router.post("/", authenticate(["account.scope.write"]), createScope);
router.patch("/:id", authenticate(["account.scope.update"]), updateScope);
router.delete("/:id", authenticate(["account.scope.delete"]), deleteScope);

export default router;
