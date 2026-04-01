import sequelize from "@/config/db.config";
import { Model, DataTypes, BelongsTo, Optional } from "sequelize";
import Scope from "./Scope.model";
import Client from "./Client.model";
import ScopeAction from "./ScopeAction.model";
import { UUID } from "@/utils/uuid.util";

type ClientScopesAttributes = {
  id: string;
  client_id: string;
  action_kode: string;
  scope_id: string;
};

type ClientScopesCreationAttributes = Optional<ClientScopesAttributes, "id">;

export class ClientScope
  extends Model<ClientScopesAttributes | ClientScopesCreationAttributes>
  implements ClientScopesAttributes
{
  public id!: string;
  public client_id!: string;
  public action_kode!: string;
  public scope_id!: string;

  public Client!: Client;
  public Scope!: Scope;
  public Action!: ScopeAction;

  public static associations: {
    Client: BelongsTo<ClientScope, Client>;
    ScopeClient: BelongsTo<ClientScope, Scope>;
    Action: BelongsTo<ClientScope, ScopeAction>;
  };
}

ClientScope.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUID.v7,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action_kode: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    scope_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ClientScopes",
    tableName: "client_scopes",
    timestamps: false,
    defaultScope: {
      order: [["client_id", "ASC"]],
      include: [{ association: "Scope" }, { association: "Action" }],
    },
    indexes: [
      {
        unique: true,
        fields: ["client_id", "scope_id", "action_kode"],
        name: "client_scope",
      },
    ],
  }
);

export default ClientScope;
