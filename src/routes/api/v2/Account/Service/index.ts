import { Router } from "express";
import {
  getAllService,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "@/controllers/v2/account/service/service.controller";
import Role from "./Role.route"
import Scope from "./Scope.route"

const router = Router({ mergeParams: true });

router.get("/", getAllService);
router.get("/:ServiceKode", getServiceById);
router.post("/", createService);
router.patch("/:ServiceKode", updateService);
router.delete("/:ServiceKode", deleteService);
router.use("/:ServiceKode/Role", Role);
router.use("/:ServiceKode/Scope", Scope)

export default router;
