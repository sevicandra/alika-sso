import { Grant } from "@/models";
import { BaseRepository } from "./base-repository";

export class GrantRepository extends BaseRepository<Grant> {
  constructor() {
    super(Grant);
  }
}
