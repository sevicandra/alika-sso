import { Router } from "express";
import { getAllAction } from "@/controllers/v2/account/referensi/scopeAction.controller";

const router = Router({ mergeParams: true });
router.get("/", getAllAction);

export default router;
