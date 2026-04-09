import { AuthorizationCodeRepository } from "./authorization-code";
import { ClientRepository } from "./client";
import { ClientGrantRepository } from "./client-grant";
import { ClientScopeRepository } from "./client-scope";
import { GrantRepository } from "./grant";
import { JabatanServiceRepository } from "./jabatan-service";
import { RedirectUriRepository } from "./redirect";
import { RefreshTokenRepository } from "./refresh-token";
import { RoleRepository } from "./role";
import { ScopeRepository } from "./scope";
import { ScopeActionRepository } from "./scope-action";
import { ServiceRepository } from "./service";
import { SessionRepository } from "./session";
import { UserRepository } from "./user";
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
const JabatanService = new JabatanServiceRepository();

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
  JabatanService,
};
