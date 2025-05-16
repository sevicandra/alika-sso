import { Router } from "express";
import {
  getAllClients,
  getClientById,
  getClientScopes,
  getClientGrant,
  getClientRedirect,
  addClientGrant,
  addClientRedirect,
  addClientScope,
  deleteClientScope,
  deleteClientRedirect,
  deleteClientGrant,
  deleteClient,
  updateClient,
  createClient,
} from "@/controllers/client.controller";
import { verifyToken } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken(["account.client.read"]), getAllClients);
router.get("/:id", verifyToken(["account.client.read"]), getClientById);
router.get(
  "/:id/scopes",
  verifyToken(["account.client.read"]),
  getClientScopes
);
router.get("/:id/grants", verifyToken(["account.client.read"]), getClientGrant);
router.get(
  "/:id/redirects",
  verifyToken(["account.client.read"]),
  getClientRedirect
);

router.post("", verifyToken(["account.client.write"]), createClient);
router.post(
  "/:id/grants",
  verifyToken(["account.client.write", "account.grant.write"]),
  addClientGrant
);
router.post(
  "/:id/redirects",
  verifyToken(["account.client.write", "account.redirect.write"]),
  addClientRedirect
);
router.post(
  "/:id/scopes",
  verifyToken(["account.client.write", "account.scope.write"]),
  addClientScope
);

router.delete(
  "/:id/scopes/:scope",
  verifyToken(["account.client.delete", "account.scope.delete"]),
  deleteClientScope
);
router.delete(
  "/:id/redirects/:redirect",
  verifyToken(["account.client.delete", "account.redirect.delete"]),
  deleteClientRedirect
);
router.delete(
  "/:id/grants/:grant",
  verifyToken(["account.client.delete", "account.grant.delete"]),
  deleteClientGrant
);

router.delete("/:id", verifyToken(["account.client.delete"]), deleteClient);

router.patch("/:id", verifyToken(["account.client.update"]), updateClient);

export default router;
