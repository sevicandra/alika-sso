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
import { authenticate } from "@/middlewares/auth.middleware";
const router = Router();

router.get("/", authenticate(["account.client.read"]), getAllClients);
router.get("/:id", authenticate(["account.client.read"]), getClientById);
router.get(
  "/:id/scopes",
  authenticate(["account.client.read"]),
  getClientScopes
);
router.get("/:id/grants", authenticate(["account.client.read"]), getClientGrant);
router.get(
  "/:id/redirects",
  authenticate(["account.client.read"]),
  getClientRedirect
);

router.post("", authenticate(["account.client.write"]), createClient);
router.post(
  "/:id/grants",
  authenticate(["account.client.write", "account.grant.write"]),
  addClientGrant
);
router.post(
  "/:id/redirects",
  authenticate(["account.client.write", "account.redirect.write"]),
  addClientRedirect
);
router.post(
  "/:id/scopes",
  authenticate(["account.client.write", "account.scope.write"]),
  addClientScope
);

router.delete(
  "/:id/scopes/:scope",
  authenticate(["account.client.delete", "account.scope.delete"]),
  deleteClientScope
);
router.delete(
  "/:id/redirects/:redirect",
  authenticate(["account.client.delete", "account.redirect.delete"]),
  deleteClientRedirect
);
router.delete(
  "/:id/grants/:grant",
  authenticate(["account.client.delete", "account.grant.delete"]),
  deleteClientGrant
);

router.delete("/:id", authenticate(["account.client.delete"]), deleteClient);

router.patch("/:id", authenticate(["account.client.update"]), updateClient);

export default router;
