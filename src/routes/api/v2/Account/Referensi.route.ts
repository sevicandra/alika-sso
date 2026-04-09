import { Router } from "express";
import {
  getGrant,
  getRole,
  getScope,
  getScopeAction,
  getService,
} from "@/controllers/v2/account/Referensi.controller";

const router = Router({ mergeParams: true });

router.get("/ScopeAction", getScopeAction);
router.get("/Grant", getGrant);
router.get("/Service", getService);
router.get("/Service/:service_kode/Scope", getScope);
router.get("/Role", getRole);

export default router;
