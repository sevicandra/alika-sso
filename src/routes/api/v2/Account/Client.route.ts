import { Router } from "express";
import { ClientControllerV2 } from "@/controllers/v2/account/client.controller";
import { z } from "zod";
import { validateBody, validateQuery } from "@/middlewares/validate-request.middleware";

const router = Router({ mergeParams: true });

const findQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  offset: z.string().regex(/^\d+$/, "Offset must be a number").optional(),
  sort: z
    .string()
    .regex(/^-?[a-zA-Z_:]+(,-?[a-zA-Z_:]+)*$/, "Format sort tidak valid")
    .optional(),
});

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

const grantCreateSchema = z.object({
  grant_kode: z.string("Grant Kode is required").regex(/^\d{3}/, "Kode must be 3 digits long"),
});

const redirectCreateSchema = z.object({
  uri: z.url("URI must be a valid URL"),
});

const scopeCreateSchema = z.object({
  scope_id: z.string("Scope ID is required"),
  action_kode: z.string("Action Kode is required").regex(/^\d{3}/, "Kode must be 3 digits long"),
});

const scopeUpdateSchema = z.object({
  scope_id: z.string("Scope ID is required").optional(),
  action_kode: z
    .string("Action Kode is required")
    .regex(/^\d{3}/, "Kode must be 3 digits long")
    .optional(),
});

router.get("/", validateQuery(findQuerySchema), ClientControllerV2.getAll);
router.get("/:ClientId", ClientControllerV2.getById);
router.post("/", validateBody(clientCreateSchema), ClientControllerV2.create);
router.delete("/:ClientId", ClientControllerV2.delete);

router.get("/:ClientId/Grant", validateQuery(findQuerySchema), ClientControllerV2.getGrants);
router.get("/:ClientId/Grant/:GrantId", ClientControllerV2.getGrantById);
router.post("/:ClientId/Grant", validateBody(grantCreateSchema), ClientControllerV2.createGrant);
router.delete("/:ClientId/Grant/:GrantId", ClientControllerV2.removeGrant);

router.get("/:ClientId/Redirect", validateQuery(findQuerySchema), ClientControllerV2.getRedirects);
router.get("/:ClientId/Redirect/:RedirectId", ClientControllerV2.getRedirectById);
router.post(
  "/:ClientId/Redirect",
  validateBody(redirectCreateSchema),
  ClientControllerV2.createRedirect
);
router.patch(
  "/:ClientId/Redirect/:RedirectId",
  validateBody(redirectCreateSchema),
  ClientControllerV2.updateRedirect
);
router.delete("/:ClientId/Redirect/:RedirectId", ClientControllerV2.removeRedirect);

router.get("/:ClientId/Scope", validateQuery(findQuerySchema), ClientControllerV2.getScopes);
router.get("/:ClientId/Scope/:ScopeId", ClientControllerV2.getScopeById);
router.post("/:ClientId/Scope", validateBody(scopeCreateSchema), ClientControllerV2.createScope);
router.patch(
  "/:ClientId/Scope/:ScopeId",
  validateBody(scopeUpdateSchema),
  ClientControllerV2.updateScope
);
router.delete("/:ClientId/Scope/:ScopeId", ClientControllerV2.removeScope);

export default router;
