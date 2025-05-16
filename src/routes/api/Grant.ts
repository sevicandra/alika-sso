import { Router } from "express";
import {
  getAllGrant,
  getGrantById,
  createGrant,
  updateGrant,
  deleteGrant,
} from "@/controllers/grant.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken(["account.grant.read"]),getAllGrant);
router.get("/:id", verifyToken(["account.grant.read"]),getGrantById);
router.post("/", verifyToken(["account.grant.write"]),createGrant);
router.patch("/:id", verifyToken(["account.grant.update"]),updateGrant);
router.delete("/:id", verifyToken(["account.grant.delete"]),deleteGrant);

export default router;
