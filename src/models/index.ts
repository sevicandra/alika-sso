import AuthorizationCode from "./AuthorizationCode.model";
import Client from "./Client.model";
import Grant from "./GrantType.model";
import RedirectUri from "./RedirectUri.model";
import RefreshToken from "./RefreshToken.model";
import Role from "./Role.model";
import Scope from "./Scope.model";
import Session from "./Session.model";
import UserAssignments from "./UserAssignments.model";
import User from "./User.model";
import Service from "./Service.model";
import ScopeAction from "./ScopeAction.model";
import ClientScope from "./ClientScope.model";
import UserRole from "./UserRole.model";
import sequelize from "@/config/db.config";
import ClientGrant from "./ClientGrant.model";

Role.belongsTo(Service, {
  foreignKey: "service_kode",
  targetKey: "kode",
  as: "Service",
});

Client.hasMany(RedirectUri, {
  foreignKey: "client_id",
  as: "RedirectUris",
});
Client.hasMany(ClientScope, {
  foreignKey: "client_id",
  as: "Scopes",
});
Client.hasMany(ClientGrant,{
  foreignKey: "client_id",
  as: "Grants",
})

Client.belongsToMany(Grant, {
  through: {
    model: ClientGrant,
    unique: true,
  },
  foreignKey: "client_id",
  otherKey: "grant_kode",
  sourceKey: "id",
  targetKey: "kode",
  as: "GrantTypes",
});

Service.hasMany(Role, {
  foreignKey: "service_kode",
  sourceKey: "kode",
  as: "Roles",
});
Service.hasMany(Scope, {
  foreignKey: "service_kode",
  sourceKey: "kode",
  as: "Scopes",
});

RedirectUri.belongsTo(Client, {
  foreignKey: "client_id",
  as: "Client",
});

ClientScope.belongsTo(Client, {
  foreignKey: "client_id",
  as: "Client",
});
ClientScope.belongsTo(Scope, {
  foreignKey: "scope_id",
  targetKey: "id",
  as: "Scope",
});
ClientScope.belongsTo(ScopeAction, {
  foreignKey: "action_kode",
  targetKey: "kode",
  as: "Action",
});

Scope.belongsTo(Service, {
  foreignKey: "service_kode",
  targetKey: "kode",
  as: "Service",
});

ClientGrant.belongsTo(Client, {
  foreignKey: "client_id",
  as: "Client",
});

ClientGrant.belongsTo(Grant, {
  foreignKey: "grant_kode",
  targetKey: "kode",
  as: "Grant",
});

UserAssignments.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_kode",
  sourceKey: "id",
  targetKey: "kode",
  as: "Roles",
});

UserAssignments.belongsTo(Service, {
  foreignKey: "service_kode",
  targetKey: "kode",
  as: "Service",
});

export {
  AuthorizationCode,
  Client,
  Grant,
  RedirectUri,
  RefreshToken,
  Role,
  Scope,
  Session,
  User,
  UserAssignments,
  Service,
  ScopeAction,
  ClientScope,
  sequelize,
  UserRole,
  ClientGrant,
};
