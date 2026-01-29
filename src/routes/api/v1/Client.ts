import { Router } from "express";
import { ClientControllerV1 } from "@/controllers/v1/client.controller";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";
import { authorizeScopes } from "@/middlewares/authenticate.middleware";

import { z } from "zod";

const clientCreateSchema = z
  .object({
    client_id: z
      .string("Client ID is required")
      .min(6, "Client ID must be at least 6 characters long"),
    client_secret: z
      .string("Secret is required")
      .min(6, "Secret must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&'~])[A-Za-z\d@$!%*?#&'~]{6,}$/,
        "Secret must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    re_client_secret: z
      .string("Re-Secret is required")
      .min(6, "Re-Secret must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&'~])[A-Za-z\d@$!%*?#&'~]{6,}$/,
        "Re-Secret must match the secret format"
      ),
  })
  .refine((data) => data.client_secret === data.re_client_secret, {
    message: "Secret and Re-Secret must be the same",
    path: ["re_client_secret"],
  });

const clientUpdateSchema = z.object({
  client_id: z
    .string("Client ID is required")
    .min(6, "Client ID must be at least 6 characters long")
    .optional(),
  client_secret: z
    .string("Secret is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&'~])[A-Za-z\d@$!%*?#&'~]{6,}$/,
      "Secret must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .optional(),
});

const clientGrantCreateSchema = z.object({
  grant: z.string("Grant is required").min(1, "Grant is required"),
});

const clientRedirectCreateSchema = z.object({
  uri: z.string("Redirect URI is required").min(1, "Redirect URI is required"),
});

const clientScopeCreateSchema = z.object({
  scopeId: z.string("Scope ID is required").min(1, "Scope ID is required"),
  action_kode: z.string("Action kode is required").min(1, "Action kode is required"),
});

const findQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  offset: z.string().regex(/^\d+$/, "Offset must be a number").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

const router = Router();

router.get(
  "/",
  authorizeScopes(["account.client.read"]),
  validateQuery(findQuerySchema),
  ClientControllerV1.getAll
);
router.get("/:ClientId", authorizeScopes(["account.client.read"]), ClientControllerV1.getById);
router.get(
  "/:ClientId/scopes",
  authorizeScopes(["account.client.read"]),
  ClientControllerV1.getScopes
);
router.get(
  "/:ClientId/grants",
  authorizeScopes(["account.client.read"]),
  ClientControllerV1.getGrants
);
router.get(
  "/:ClientId/redirects",
  authorizeScopes(["account.client.read"]),
  ClientControllerV1.getRedirects
);

router.post(
  "/",
  authorizeScopes(["account.client.write"]),
  validateBody(clientCreateSchema),
  ClientControllerV1.create
);
router.post(
  "/:ClientId/grants",
  authorizeScopes(["account.client.write", "account.grant.write"]),
  validateBody(clientGrantCreateSchema),
  ClientControllerV1.addGrant
);
router.post(
  "/:ClientId/redirects",
  authorizeScopes(["account.client.write", "account.redirect.write"]),
  validateBody(clientRedirectCreateSchema),
  ClientControllerV1.addRedirect
);
router.post(
  "/:ClientId/scopes",
  authorizeScopes(["account.client.write", "account.scope.write"]),
  validateBody(clientScopeCreateSchema),
  ClientControllerV1.addScope
);

router.delete(
  "/:ClientId/scopes/:ScopeId",
  authorizeScopes(["account.client.delete", "account.scope.delete"]),
  ClientControllerV1.removeScope
);
router.delete(
  "/:ClientId/redirects/:RedirectId",
  authorizeScopes(["account.client.delete", "account.redirect.delete"]),
  ClientControllerV1.removeRedirect
);
router.delete(
  "/:ClientId/grants/:GrantId",
  authorizeScopes(["account.client.delete", "account.grant.delete"]),
  ClientControllerV1.removeGrant
);

router.delete("/:ClientId", authorizeScopes(["account.client.delete"]), ClientControllerV1.delete);

router.patch(
  "/:ClientId",
  authorizeScopes(["account.client.update"]),
  validateBody(clientUpdateSchema),
  ClientControllerV1.update
);

export default router;
