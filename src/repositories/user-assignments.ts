import { UserAssignments } from "@/models";
import { BaseRepository } from "./base-repository";

export class UserAssignmentsRepository extends BaseRepository<UserAssignments> {
  constructor() {
    super(UserAssignments);
  }
}
