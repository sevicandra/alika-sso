import { Router } from "express";
import {
  getAllClientScopes,
  getClientScopeById,
  createClientScope,
  updateClientScope,
  deleteClientScope,
} from "@/controllers/v1/clientScope.controller";
import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", authenticate(["account.clientscope.read"]), getAllClientScopes);
router.get(
  "/:id",
  authenticate(["account.clientscope.read"]),
  getClientScopeById
);
router.post("/", authenticate(["account.clientscope.write"]), createClientScope);
router.patch(
  "/:id",
  authenticate(["account.clientscope.update"]),
  updateClientScope
);
router.delete(
  "/:id",
  authenticate(["account.clientscope.delete"]),
  deleteClientScope
);

export default router;
