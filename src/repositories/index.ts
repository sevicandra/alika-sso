import { AuthorizationCodeRepository } from "./authorization-code";
import { ClientRepository } from "./client";
import { GrantRepository } from "./grant";
import { RedirectUriRepository } from "./redirect";
import { RefreshTokenRepository } from "./refresh-token";
import { RoleRepository } from "./role";
import { ScopeActionRepository } from "./scope-action";
import { ScopeRepository } from "./scope";
import { SessionRepository } from "./session";
import { ServiceRepository } from "./service";
import { UserRepository } from "./user";
import { ClientScopeRepository } from "./client-scope";
import { ClientGrantRepository } from "./client-grant";
import { UserAssignmentsRepository } from "./user-assignments";
import { UserRoleRepository } from "./user-role";

const AuthorizationCode = new AuthorizationCodeRepository();
const Client = new ClientRepository();
const Grant = new GrantRepository();
const RedirectUri = new RedirectUriRepository();
const RefreshToken = new RefreshTokenRepository();
const Role = new RoleRepository();
const ScopeAction = new ScopeActionRepository();
const Scope = new ScopeRepository();
const Service = new ServiceRepository();
const Session = new SessionRepository();
const User = new UserRepository();
const ClientScope = new ClientScopeRepository();
const ClientGrant = new ClientGrantRepository();
const UserAssignments = new UserAssignmentsRepository();
const UserRole = new UserRoleRepository();

export {
  AuthorizationCode,
  Client,
  Grant,
  RedirectUri,
  RefreshToken,
  Role,
  ScopeAction,
  Scope,
  Service,
  User,
  ClientScope,
  ClientGrant,
  UserAssignments,
  UserRole,
  Session,
};
