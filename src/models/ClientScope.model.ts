import sequelize from "@/config/db.config";
import { Model, DataTypes, BelongsTo } from "sequelize";
import Scope from "./Scope.model";
import Client from "./Client.model";
import ScopeAction from "./ScopeAction.model";

type ClientScopesAttributes = {
  clientId: string;
  action_kode: string;
  scopeId: string;
};

export class ClientScope
  extends Model<ClientScopesAttributes>
  implements ClientScopesAttributes
{
  public clientId!: string;
  public action_kode!: string;
  public scopeId!: string;

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
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    action_kode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey: true,
    },
    scopeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "ClientScopes",
    tableName: "client_scopes",
    timestamps: false,
    defaultScope: {
      order: [["clientId", "ASC"]],
      include: [{ association: "Scope" }, { association: "Action" }],
    },
  }
);

export default ClientScope;
