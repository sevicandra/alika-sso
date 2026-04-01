import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, HasMany, BelongsToMany } from "sequelize";
import Grant from "./GrantType.model";
import RedirectUri from "./RedirectUri.model";
import { hash } from "@/utils/crypt.util";
import { UUID } from "@/utils/uuid.util";
import ClientScopes from "./ClientScope.model";
import ClientGrant from "./ClientGrant.model";

type ClientAttributes = {
  id: string;
  client_id: string;
  client_secret: string;
};

type ClientCreationAttributes = Optional<ClientAttributes, "id">;

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: string;
  public client_id!: string;
  public client_secret!: string;

  // Declare the association properties
  public GrantTypes!: Grant[] | [];
  public RedirectUris!: RedirectUri[] | [];
  public Scopes!: ClientScopes[] | [];

  public static associations: {
    Scopes: HasMany<Client, ClientScopes>;
    GrantTypes: BelongsToMany<Client, Grant>;
    RedirectUris: HasMany<Client, RedirectUri>;
  };
  async addScope({ scopeId, action_kode }: { scopeId: string; action_kode: string }) {
    await ClientScopes.create({
      client_id: this.id,
      scope_id: scopeId,
      action_kode,
    });
  }
  async removeScope({ scopeId, action_kode }: { scopeId: string; action_kode: string }) {
    await ClientScopes.destroy({
      where: { client_id: this.id, scope_id: scopeId, action_kode },
    });
  }
  async addGrantType(grantType: string) {
    await ClientGrant.create({ client_id: this.id, grant_kode: grantType });
  }
  async removeGrantType(grantType: string) {
    await ClientGrant.destroy({
      where: { client_id: this.id, grant_kode: grantType },
    });
  }
  async addRedirectUri(redirectUri: string) {
    await RedirectUri.create({ client_id: this.id, uri: redirectUri });
  }
  async removeRedirectUri(redirectId: string) {
    await RedirectUri.destroy({
      where: { client_id: this.id, id: redirectId },
    });
  }
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "id",
        msg: "Client ID already exists",
      },
      validate: {
        min: {
          args: [6],
          msg: "Client ID must be at least 6 characters",
        },
        notEmpty: {
          msg: "Client ID is required",
        },
        notNull: {
          msg: "Client ID is required",
        },
      },
    },
    client_secret: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Secret is required",
        },
        notNull: {
          msg: "Secret is required",
        },
        min: {
          args: [6],
          msg: "Secret must be at least 6 characters",
        },
        is: {
          args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&'~])[A-Za-z\d@$!%*?#&'~]{6,}$/],
          msg: "Secret must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
    hooks: {
      afterValidate: async (client: Client, options) => {
        if (client.client_secret && !options.skip?.some((s) => s === "client_secret")) {
          client.client_secret = await hash(client.client_secret);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ["client_secret"] },
    },
    scopes: {
      withSecret: {
        attributes: { include: ["client_secret"] },
      },
    },
  }
);

export default Client;
