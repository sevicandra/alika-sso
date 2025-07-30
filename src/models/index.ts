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

Role.belongsTo(Service, {
  foreignKey: "service_kode",
  targetKey: "kode",
  as: "Service",
});

Client.hasMany(RedirectUri, {
  foreignKey: "clientId",
  as: "RedirectUris",
});
Client.hasMany(ClientScope, {
  foreignKey: "clientId",
  as: "Scopes",
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
  foreignKey: "clientId",
  as: "Client",
});

ClientScope.belongsTo(Client, {
  foreignKey: "clientId",
  as: "Client",
});
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

Scope.belongsTo(Service, {
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
};
