import { Router } from "express";
import { getAllGrant } from "@/controllers/v2/account/referensi/grant.controller";

const router = Router({ mergeParams: true });
router.get("/", getAllGrant);

export default router;
