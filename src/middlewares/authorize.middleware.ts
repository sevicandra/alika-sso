import { NextFunction, Response } from "express";
import { AuthenticationError } from "@/utils/errors";
import { Client } from "@/repositories";
import { CodeRequest } from "@/types/auth";
import { asyncHandler } from "./async-handler.middleware";

export const checkRequest = asyncHandler(
  async (req: CodeRequest, _res: Response, next: NextFunction): Promise<void> => {
    const redirectUri = req.query.redirect_uri as string;
    const clientId = req.query.client_id as string;
    const scope = req.query.scope as string;
    const client = await Client.findOne({
      where: { client_id: clientId },
      include: [
        {
          association: "GrantTypes",
          attributes: ["grant"],
        },
        {
          association: "RedirectUris",
          attributes: ["uri"],
        },
        {
          association: "Scopes",
        },
      ],
    });
    if (!client) {
      throw new AuthenticationError("Client not found");
    }
    if (!client.GrantTypes || !client.RedirectUris || !client.Scopes) {
      throw new AuthenticationError("Client is not valid");
    }
    if (!client.GrantTypes.map((g) => g.grant).includes("authorization_code")) {
      throw new AuthenticationError("Client grant is not valid");
    }
    if (!client.RedirectUris.map((r) => r.uri).includes(redirectUri)) {
      throw new AuthenticationError("Client redirect uri is not valid");
    }
    const clientScopes = client.Scopes.map(
      (s) => s.Scope.Service.name + "." + s.Scope.scope + "." + s.Action.name
    );
    const validScopes = scope
      .split(" ")
      .filter((s) => clientScopes.includes(s))
      .join(" ");
    req.scope = validScopes;
    next();
  }
);
