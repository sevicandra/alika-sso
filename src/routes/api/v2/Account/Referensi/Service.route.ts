import { Router } from "express";
import {
  getAllService,
  getAllScope,
} from "@/controllers/v2/account/referensi/service.controller";

const router = Router({ mergeParams: true });
router.get("/", getAllService);
router.get("/:service_kode/scope", getAllScope);

export default router;
