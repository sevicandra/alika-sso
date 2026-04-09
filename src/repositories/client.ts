import { Transaction } from "sequelize";
import { NotFoundError } from "@/utils/errors";
import { handleSequelizeError } from "@/utils/errors/sequelize-error-handler";
import { Client } from "@/models";
import { ClientGrant, ClientScope, RedirectUri } from ".";
import { BaseRepository } from "./base-repository";

export class ClientRepository extends BaseRepository<Client> {
  constructor() {
    super(Client);
  }

  async getScopes(ClientId: string): Promise<
    {
      clientId: string;
      service: string;
      scope: string;
      action: string;
    }[]
  > {
    try {
      const data = await this.findById(ClientId, {
        include: [
          {
            association: "Scopes",
          },
        ],
      });
      if (!data) {
        throw new NotFoundError("Client not found");
      }
      return data.Scopes.map((scope) => {
        return {
          clientId: scope.client_id,
          service: scope.Scope.Service.name,
          scope: scope.Scope.scope,
          action: scope.Action.name,
        };
      });
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async getScopeById(ClientId: string, ScopeId: string) {
    try {
      const data = await ClientScope.findOne({
        where: {
          client_id: ClientId,
          id: ScopeId,
        },
        include: [
          {
            association: "Scope",
            include: [
              {
                association: "Service",
              },
            ],
          },
          {
            association: "Action",
          },
        ],
      });

      if (!data) {
        throw new NotFoundError("Scope not found");
      }

      return {
        id: data.id,
        service_kode: data.Scope.Service.kode,
        action_kode: data.Action.kode,
        scope_id: data.Scope.id,
      };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async addScope(
    client_id: string,
    scope_id: string,
    action_kode: string,
    t: Transaction
  ): Promise<void> {
    try {
      await ClientScope.create(
        {
          client_id: client_id,
          scope_id: scope_id,
          action_kode: action_kode,
        },
        {
          transaction: t,
        }
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async updateScope(
    finder: {
      ClientId: string;
      ClientScopeId: string;
    },
    payload: {
      scope_id: string;
      action_kode: string;
    },
    t: Transaction
  ) {
    try {
      return await ClientScope.update(
        { action_kode: payload.action_kode, scope_id: payload.scope_id },
        {
          where: {
            client_id: finder.ClientId,
            id: finder.ClientScopeId,
          },
          transaction: t,
        }
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async removeScope(
    client_id: string,
    scope_id: string,
    action_kode: string,
    t: Transaction
  ): Promise<void> {
    try {
      await ClientScope.deleteOne(
        {
          where: {
            client_id: client_id,
            scope_id: scope_id,
            action_kode: action_kode,
          },
        },
        t
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async getGrants(ClientId: string): Promise<
    {
      kode: string;
      grant_type: string;
    }[]
  > {
    try {
      const data = await this.findById(ClientId, {
        include: [
          {
            association: "GrantTypes",
          },
        ],
      });

      if (!data) {
        throw new NotFoundError("Client not found");
      }

      return data.GrantTypes.map((gt) => ({
        kode: gt.kode,
        grant_type: gt.grant,
      }));
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async getGrantById(ClientId: string, GrantId: string) {
    try {
      const data = await ClientGrant.findOne({
        where: {
          client_id: ClientId,
          id: GrantId,
        },
        include: [
          {
            association: "Grant",
          },
        ],
      });

      return data;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async addGrant(ClientId: string, grant: string, t: Transaction): Promise<void> {
    try {
      await ClientGrant.create(
        { client_id: ClientId, grant_kode: grant },
        {
          transaction: t,
        }
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async updateGrant(ClientId: string, GrantId: string, grant: string, t: Transaction) {
    try {
      await ClientGrant.update(
        { grant_kode: grant },
        {
          where: {
            id: GrantId,
            client_id: ClientId,
          },
          transaction: t,
        }
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async removeGrant(ClientId: string, grant: string, t: Transaction): Promise<void> {
    try {
      await ClientGrant.deleteOne(
        {
          where: {
            client_id: ClientId,
            grant_kode: grant,
          },
        },
        t
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async getRedirectUris(ClientId: string): Promise<string[]> {
    try {
      const data = await this.findById(ClientId, {
        include: [
          {
            association: "RedirectUris",
          },
        ],
      });

      if (!data) {
        throw new NotFoundError("Client not found");
      }

      return data.RedirectUris.map((ru) => ru.uri);
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async getRedirectUriById(ClientId: string, RedirectUriId: string) {
    try {
      const data = await RedirectUri.findOne({
        where: {
          client_id: ClientId,
          id: RedirectUriId,
        },
      });

      return data;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async addRedirectUri(ClientId: string, uri: string, t: Transaction): Promise<void> {
    try {
      await RedirectUri.create(
        { client_id: ClientId, uri },
        {
          transaction: t,
        }
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async updateRedirectUri(ClientId: string, uri: string, t: Transaction): Promise<void> {
    try {
      await RedirectUri.update(
        { uri },
        {
          where: {
            client_id: ClientId,
          },
          transaction: t,
        }
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async removeRedirectUri(ClientId: string, uri: string, t: Transaction): Promise<void> {
    try {
      await RedirectUri.deleteOne(
        {
          where: {
            client_id: ClientId,
            uri,
          },
        },
        t
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }
}
