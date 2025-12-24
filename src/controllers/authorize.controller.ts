import { Response, Request } from "express";
import { AuthorizationCode } from "@/repositories";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError } from "@/utils/errors";

export const getAuthorizationCode = asyncHandler(
  async (req: Request, res: Response) => {
    const t = req.transaction;
    if (!t) {
      throw new InvalidRequestError("Transaksi tidak ditemukan");
    }
    const session = req.session;
    if (!session) {
      throw new InvalidRequestError("Session tidak ditemukan");
    }
    const {client_id, redirect_uri, scope} = req.query;

    const code = await AuthorizationCode.create({
      client_id: client_id as string,
      user_id: session.passport?.user,
      scope: scope as string|| "",
      redirect_uri: redirect_uri as string,
      sessionId: req.sessionID,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });
    res.redirect(
      `${req.query.redirect_uri}?code=${code.code}${
        req.query.state ? `&state=${req.query.state}` : ""
      }`
    );
  },
  {
    useTransaction: true,
  }
);
