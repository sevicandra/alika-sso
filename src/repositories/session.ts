import { Session } from "@/models";
import { BaseRepository } from "./base-repository";

export class SessionRepository extends BaseRepository<Session> {
  constructor() {
    super(Session);
  }
}

