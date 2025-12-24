import { ScopeAction } from "@/models";
import { BaseRepository } from "./base-repository";

export class ScopeActionRepository extends BaseRepository<ScopeAction> {
  constructor() {
    super(ScopeAction);
  }
}

