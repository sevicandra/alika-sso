import axios from "axios";
import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";
import logger from "@/utils/Logger.utils";
import { AuthenticationError } from "@/utils/errors";
import { passportConfig } from "@/config/passport.config";
import { User } from "@/repositories";
import { Profile2 } from "@/types/serviceKemenkeu";
import { KemenkeuService } from "./kemenkeu.service";

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: `${passportConfig.BASE_URI}/${passportConfig.AUTHORIZE_ENDPOINT}`,
      tokenURL: `${passportConfig.BASE_URI}/${passportConfig.TOKEN_ENDPOINT}`,
      clientID: `${passportConfig.CLIENT_ID}`,
      clientSecret: passportConfig.CLIENT_SECRET,
      callbackURL: passportConfig.REDIRECT_URI,
      scope: passportConfig.SCOPE,
    },
    async function (
      accessToken: string,
      _refreshToken: string,
      _profile: typeof User,
      cb: VerifyCallback
    ) {
      if (!accessToken) {
        return cb(new AuthenticationError("No access token provided"));
      }
      try {
        const userInfoResponse = await axios.get(
          `${passportConfig.BASE_URI}/${passportConfig.USERINFO_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            timeout: 120000,
          }
        );

        if (!userInfoResponse.data?.nip) {
          return cb(new AuthenticationError("Invalid user info: missing NIP"));
        }
        let profile: Profile2;
        try {
          profile = await KemenkeuService.getProfilHris2({
            nip: userInfoResponse.data.nip,
          });
        } catch (error: any) {
          let errorMessage = error instanceof Error ? error.message : String(error);
          let errorDetails = error;

          if (axios.isAxiosError(error)) {
            const targetUrl = error.config?.url ? ` [Target: ${error.config.url}]` : "";
            errorMessage = `AxiosError${targetUrl}: ${error.message}`;
            errorDetails = error.response?.data || error.message;
          }

          logger.error("Failed to fetch Kemenkeu profile during OAuth", {
            nip: userInfoResponse.data.nip,
            error: errorMessage,
            details: errorDetails,
          });
          return cb(
            new AuthenticationError(`Failed to fetch Kemenkeu profile: ${errorMessage}`, {
              details: errorDetails,
            })
          );
        }

        if (!profile.jabatan || profile.jabatan.length === 0) {
          throw new AuthenticationError("User profile is missing job position (jabatan data)");
        }

        const activeJabatan =
          profile.jabatan.find((j) => j.statusJabatan?.toLocaleLowerCase() === "definitif") ||
          profile.jabatan[0];

        if (!activeJabatan) {
          throw new AuthenticationError("No valid job position found in user profile");
        }

        const userData = {
          name: profile.nama,
          email: profile.email,
          kode_kl: userInfoResponse.data.kode_kl,
          nama_kl: userInfoResponse.data.nama_kl,
          nip: profile.nip18,
          jabatan: activeJabatan.namaJabatan,
          jenis_jabatan: activeJabatan.jenisJabatan,
          kode_organisasi: activeJabatan.kodeOrganisasi,
          organisasi: activeJabatan.organisasi,
          kode_satker: profile.kdSatker,
          satker: profile.namaSatker,
          gravatar: userInfoResponse.data.gravatar,
          preferred_username: userInfoResponse.data.preferred_username,
          nik: profile.nik,
          npwp: profile.npwp ? profile.npwp.replace(/\D/g, "") : "",
        };

        let user = await User.findOne({
          where: { nip: userData.nip },
        });

        if (user) {
          await user.update(userData);
        } else {
          user = await User.create(userData);
        }
        cb(null, user);
      } catch (error: any) {
        let errorMessage = error instanceof Error ? error.message : String(error);
        let errorDetails = error;

        if (axios.isAxiosError(error)) {
          const targetUrl = error.config?.url ? ` [Target: ${error.config.url}]` : "";
          errorMessage = `AxiosError${targetUrl}: ${error.message}`;
          errorDetails = error.response?.data || error.message;
        }

        logger.error("OAuth strategy verification failed", {
          error: errorMessage,
          details: errorDetails,
        });

        return cb(
          new AuthenticationError(`OAuth authentication failed: ${errorMessage}`, {
            details: errorDetails,
          })
        );
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.sub);
});
passport.deserializeUser(async (sub: string, done) => {
  try {
    if (!sub) {
      return done(null, false);
    }

    const user = await User.findOne({ where: { sub } });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    logger.error("User deserialization failed", {
      sub,
      error: error instanceof Error ? error.message : String(error),
    });
    done(error);
  }
});

export default passport;
