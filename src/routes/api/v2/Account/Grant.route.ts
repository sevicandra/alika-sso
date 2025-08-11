import { Router } from "express";
import {
  getAllGrant,
  getGrantById,
  createGrant,
  updateGrant,
  deleteGrant,
} from "@/controllers/v2/account/grant.controller";
const router = Router({ mergeParams: true });

router.get("/", getAllGrant);
router.get("/:id", getGrantById);
router.post("/", createGrant);
router.patch("/:id", updateGrant);
router.delete("/:id", deleteGrant);

export default router;
