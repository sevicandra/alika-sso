import { UserRole } from "@/models";
import { BaseRepository } from "./base-repository";

export class UserRoleRepository extends BaseRepository<UserRole> {
  constructor() {
    super(UserRole);
  }
}
