import { Router } from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceRole,
  createServiceRole,
  deleteServiceRole,
  getServiceScope,
  createServiceScope,
  deleteServiceScope,
} from "@/controllers/service.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken(["account.service.read"]), getAllServices);
router.get("/:id", verifyToken(["account.service.read"]), getServiceById);
router.get("/:id/roles", verifyToken(["account.service.read"]), getServiceRole);
router.get(
  "/:id/scopes",
  verifyToken(["account.service.read"]),
  getServiceScope
);

router.post("/", verifyToken(["account.service.write"]), createService);
router.post(
  "/:id/roles",
  verifyToken(["account.service.write", "account.role.write"]),
  createServiceRole
);
router.post(
  "/:id/scopes",
  verifyToken(["account.service.write", "account.scope.write"]),
  createServiceScope
);

router.patch("/:id", verifyToken(["account.service.update"]), updateService);

router.delete("/:id", verifyToken(["account.service.delete"]), deleteService);
router.delete(
  "/:id/roles/:role_id",
  verifyToken(["account.service.delete", "account.role.delete"]),
  deleteServiceRole
);
router.delete(
  "/:id/scopes/:scope_id",
  verifyToken(["account.service.delete", "account.scope.delete"]),
  deleteServiceScope
);

export default router;
