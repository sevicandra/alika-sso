import session, { Store } from "express-session";
import { Session } from "@/models";

class SessionStore extends Store {
  constructor() {
    super();
  }
  async get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void
  ) {
    try {
      const session = await Session.findOne({
        where: { sessionId: sid },
      });
      if (session) {
        callback(null, JSON.parse(session.data));
      } else {
        callback(null, null);
      }
    } catch (err) {
      callback(err);
    }
  }
  async set(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ) {
    try {
      const expires = new Date(sessionData.cookie.expires || 0);
      await Session.upsert({
        sessionId: sid,
        data: JSON.stringify(sessionData),
        expires: expires,
      });
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
    }
  }
  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await Session.destroy({ where: { sessionId: sid } });
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
    }
  }
}

export default SessionStore;
