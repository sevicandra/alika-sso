import { ClientGrant } from "@/models";
import { BaseRepository } from "./base-repository";

export class ClientGrantRepository extends BaseRepository<ClientGrant> {
  constructor() {
    super(ClientGrant);
  }
}
