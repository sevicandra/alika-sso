import { Router } from "express";
import {
  getAllClientGrant,
  getClientGrantById,
  createClientGrant,
  deleteClientGrant,
} from "@/controllers/v2/account/client/grant.controller";

const router = Router({ mergeParams: true });

router.get("/", getAllClientGrant);
router.get("/:ClientGrantId", getClientGrantById);
router.post("/", createClientGrant);
router.delete("/:ClientGrantId", deleteClientGrant);

export default router;