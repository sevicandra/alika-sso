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
import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", authenticate(["account.service.read"]), getAllServices);
router.get("/:id", authenticate(["account.service.read"]), getServiceById);
router.get("/:id/roles", authenticate(["account.service.read"]), getServiceRole);
router.get(
  "/:id/scopes",
  authenticate(["account.service.read"]),
  getServiceScope
);

router.post("/", authenticate(["account.service.write"]), createService);
router.post(
  "/:id/roles",
  authenticate(["account.service.write", "account.role.write"]),
  createServiceRole
);
router.post(
  "/:id/scopes",
  authenticate(["account.service.write", "account.scope.write"]),
  createServiceScope
);

router.patch("/:id", authenticate(["account.service.update"]), updateService);

router.delete("/:id", authenticate(["account.service.delete"]), deleteService);
router.delete(
  "/:id/roles/:role_id",
  authenticate(["account.service.delete", "account.role.delete"]),
  deleteServiceRole
);
router.delete(
  "/:id/scopes/:scope_id",
  authenticate(["account.service.delete", "account.scope.delete"]),
  deleteServiceScope
);

export default router;
