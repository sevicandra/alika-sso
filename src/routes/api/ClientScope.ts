import { Router } from "express";
import {
  getAllClientScopes,
  getClientScopeById,
  createClientScope,
  updateClientScope,
  deleteClientScope,
} from "@/controllers/clientScope.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken(["account.clientscope.read"]), getAllClientScopes);
router.get(
  "/:id",
  verifyToken(["account.clientscope.read"]),
  getClientScopeById
);
router.post("/", verifyToken(["account.clientscope.write"]), createClientScope);
router.patch(
  "/:id",
  verifyToken(["account.clientscope.update"]),
  updateClientScope
);
router.delete(
  "/:id",
  verifyToken(["account.clientscope.delete"]),
  deleteClientScope
);

export default router;
