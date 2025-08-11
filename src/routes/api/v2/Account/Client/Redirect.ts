import { Router } from "express";
import {
  getAllRedirect,
  getRedirectById,
  createRedirect,
  updateRedirect,
  deleteRedirect,
} from "@/controllers/v2/account/client/redirect.controller";

const router = Router({ mergeParams: true });

router.get("/", getAllRedirect);
router.get("/:RedirectId", getRedirectById);
router.post("/", createRedirect);
router.patch("/:RedirectId", updateRedirect);
router.delete("/:RedirectId", deleteRedirect);

export default router;
