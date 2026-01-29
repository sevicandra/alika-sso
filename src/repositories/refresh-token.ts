import { RefreshToken } from "@/models";
import { BaseRepository } from "./base-repository";

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor() {
    super(RefreshToken);
  }
}
