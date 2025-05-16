import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes, Op, HasMany, BelongsTo } from "sequelize";
import Grant from "./GrantType.model";
import RedirectUri from "./RedirectUri.model";
import Scope from "./Scope.model";
import Client from "./Client.model";
import ScopeAction from "./ScopeAction.model";
import { hashPassword } from "@/utils/hashPassword.util";
import { UUID } from "@/utils/uuid.util";

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


ClientScope.belongsTo(Scope, {
  foreignKey: "scopeId",
  targetKey: "id",
  as: "Scope",
});
ClientScope.belongsTo(ScopeAction, {
  foreignKey: "action_kode",
  targetKey: "kode",
  as: "Action",
});

export default ClientScope;
