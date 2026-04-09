import { NextFunction, Request, Response } from "express";
import { verify } from "@/utils/crypt.util";
import { AuthenticationError } from "@/utils/errors";
import { Client } from "@/repositories";
import { asyncHandler } from "../async-handler.middleware";
import { authorizationCodeGrant } from "./authorizationCode.middleware";
import { clientCredentialsGrant } from "./clientCredentials.middleware";
import { refreshTokenGrant } from "./refreshToken.middleware";

export const verifyClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const decode = async (authorization: string) => {
      return Buffer.from(authorization, "base64").toString("utf-8");
    };
    const client_id =
      (await req.body.client_id) ||
      (req.headers.authorization?.split(" ")[1]?.toString() &&
        (await decode(req.headers.authorization?.split(" ")[1]?.toString())).split(":")[0]);

    const client_secret =
      (await req.body.client_secret) ||
      (req.headers.authorization?.split(" ")[1]?.toString() &&
        (await decode(req.headers.authorization?.split(" ")[1]?.toString())).split(":")[1]);

    const client = await Client.findOne({
      where: { client_id: client_id },
      include: [
        {
          association: "GrantTypes",
        },
        {
          association: "Scopes",
        },
        {
          association: "RedirectUris",
        },
      ],
      attributes: {
        include: ["client_id", "client_secret"],
      },
    });

    if (!client) {
      throw new AuthenticationError("Client not found");
    }

    if (!(await verify(client_secret, client.client_secret))) {
      throw new AuthenticationError("Client not found");
    }
    req.client = {
      id: client.id,
      client_id: client.client_id,
      grant_types: client.GrantTypes.map((gt) => gt.grant),
      scopes: client.Scopes.map(
        (s) => s.Scope.Service.name + "." + s.Scope.scope + "." + s.Action.name
      ),
      redirect_uris: client.RedirectUris.map((ru) => ru.uri),
    };
    switch (req.body.grant_type) {
      case "client_credentials":
        await clientCredentialsGrant(req, res, next);
        break;
      case "authorization_code":
        await authorizationCodeGrant(req, res, next);
        break;
      case "refresh_token":
        await refreshTokenGrant(req, res, next);
        break;
      default:
        throw new AuthenticationError("Invalid grant type");
        break;
    }
  }
);
