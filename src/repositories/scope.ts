import { Scope } from "@/models";
import { BaseRepository } from "./base-repository";

export class ScopeRepository extends BaseRepository<Scope> {
  constructor() {
    super(Scope);
  }
}
