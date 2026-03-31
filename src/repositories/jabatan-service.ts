import { JabatanService } from "@/models";
import { BaseRepository } from "./base-repository";

export class JabatanServiceRepository extends BaseRepository<JabatanService> {
  constructor() {
    super(JabatanService);
  }
}
