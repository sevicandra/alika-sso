import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { verify } from "@/utils/crypt.util";
import { InvalidRequestError } from "@/utils/errors";
import { JwtUtil } from "@/utils/jwt.util";
import { appConfig } from "@/config/app.config";
import { passportConfig } from "@/config/passport.config";
import { successResponse } from "@/helpers/respose.helper";
import { RefreshToken } from "@/models";
import { Session } from "@/models";

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refresh_token = req.body.refresh_token;
  const decoded: any = await JwtUtil.verifyToken(refresh_token);
  const token = decoded.token;
  const sessionId = decoded.sessionId;
  const sub = req.user?.sub;
  if (!token) {
    throw new InvalidRequestError("Invalid refresh token");
  }

  const refreshToken = await RefreshToken.findByPk(decoded.id);

  if (!refreshToken) {
    throw new InvalidRequestError("Invalid refresh token");
  }

  if (refreshToken.userId !== sub) {
    throw new InvalidRequestError("Invalid client");
  }
  if (!(await verify(token, refreshToken.token))) {
    throw new InvalidRequestError("Invalid refresh token");
  }
  await refreshToken.destroy();
  await Session.findByPk(sessionId).then(async (session) => {
    if (session) {
      await session.destroy();
    }
  });
  res.clearCookie(`${appConfig.NAME || "SSO"}.session`);
  successResponse(
    res,
    "Logout berhasil",
    {
      redirect: `${passportConfig.BASE_URI}/${passportConfig.ENDSESSION_ENDPOINT}`,
    },
    200
  );
});
