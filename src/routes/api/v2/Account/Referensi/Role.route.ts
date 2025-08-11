import { Router } from "express";
import { getAllRole } from "@/controllers/v2/account/referensi/role.controller";

const router = Router({ mergeParams: true });
router.get("/", getAllRole);

export default router;
