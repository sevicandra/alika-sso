import { AuthorizationCode } from "@/models";
import { BaseRepository } from "./base-repository";

export class AuthorizationCodeRepository extends BaseRepository<AuthorizationCode> {
  constructor() {
    super(AuthorizationCode);
  }
}
