import { Router } from "express";
import {
  getAllGrant,
  getGrantById,
  createGrant,
  updateGrant,
  deleteGrant,
} from "@/controllers/v1/grant.controller";
import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", authenticate(["account.grant.read"]),getAllGrant);
router.get("/:id", authenticate(["account.grant.read"]),getGrantById);
router.post("/", authenticate(["account.grant.write"]),createGrant);
router.patch("/:id", authenticate(["account.grant.update"]),updateGrant);
router.delete("/:id", authenticate(["account.grant.delete"]),deleteGrant);

export default router;
