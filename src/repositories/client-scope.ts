import { ClientScope } from "@/models";
import { BaseRepository } from "./base-repository";

export class ClientScopeRepository extends BaseRepository<ClientScope> {
  constructor() {
    super(ClientScope);
  }
}
