import { Router } from "express";
import {
  getAllClientScope,
  getClientScopeById,
  createClientScope,
  updateClientScope,
  deleteClientScope,
} from "@/controllers/v2/account/client/scope.controller";

const router = Router({ mergeParams: true });

router.get("/", getAllClientScope);
router.get("/:ClientScopeId", getClientScopeById);
router.post("/", createClientScope);
router.patch("/:ClientScopeId", updateClientScope);
router.delete("/:ClientScopeId", deleteClientScope);

export default router;
