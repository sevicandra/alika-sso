import { RedirectUri } from "@/models";
import { BaseRepository } from "./base-repository";

export class RedirectUriRepository extends BaseRepository<RedirectUri> {
  constructor() {
    super(RedirectUri);
  }
}
