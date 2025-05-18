import sequelize from "@/config/db.config";
import {
  Model,
  Optional,
  DataTypes,
  HasMany,
  BelongsToMany,
} from "sequelize";
import Grant from "./GrantType.model";
import RedirectUri from "./RedirectUri.model";
import { hash } from "@/utils/crypt.util";
import { UUID } from "@/utils/uuid.util";
import ClientScopes from "./ClientScope.model";
type ClientAttributes = {
  id: string;
  client_id: string;
  client_secret: string;
};

type ClientGrantTypeAttributes = {
  clientId: string;
  grant: string;
};

type ClientCreationAttributes = Optional<ClientAttributes, "id">;

class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
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
  async addScope({
    scopeId,
    action_kode,
  }: {
    scopeId: string;
    action_kode: string;
  }) {
    await ClientScopes.create({ clientId: this.id, scopeId, action_kode });
  }
  async removeScope({
    scopeId,
    action_kode,
  }: {
    scopeId: string;
    action_kode: string;
  }) {
    await ClientScopes.destroy({
      where: { clientId: this.id, scopeId, action_kode },
    });
  }
  async addGrantType(grantType: string) {
    await ClientGrantType.create({ clientId: this.id, grant: grantType });
  }
  async removeGrantType(grantType: string) {
    await ClientGrantType.destroy({
      where: { clientId: this.id, grant: grantType },
    });
  }
  async addRedirectUri(redirectUri: string) {
    await RedirectUri.create({ clientId: this.id, uri: redirectUri });
  }
  async removeRedirectUri(redirectId: string) {
    await RedirectUri.destroy({
      where: { clientId: this.id, id: redirectId },
    });
  }
}

Client.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
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
          args: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          ],
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
        if (
          client.client_secret &&
          !options.skip?.some((s) => s === "client_secret")
        ) {
          client.client_secret = await hash(client.client_secret);
        }
      },

      beforeCreate: (data) => {
        data.id = UUID.v7();
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

class ClientGrantType extends Model<ClientGrantTypeAttributes> {
  public clientId!: string;
  public grant!: string;
}
ClientGrantType.init(
  {
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    grant: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "ClientGrantType",
    tableName: "client_grant_types",
  }
);
Client.belongsToMany(Grant, {
  through: {
    model: ClientGrantType,
    unique: true,
  },
  foreignKey: "clientId",
  otherKey: "grant",
  sourceKey: "id",
  targetKey: "kode",
  as: "GrantTypes",
});

export default Client;
