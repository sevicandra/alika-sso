import { passportConfig } from "@/config/passport.config";
import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";
import User from "../models/User.model";
import axios from "axios";

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
      refreshToken: string,
      profile: User,
      cb: VerifyCallback
    ) {
      try {
        const userInfo = await axios.get(
          `${passportConfig.BASE_URI}/${passportConfig.USERINFO_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const user = await User.findOne({
          where: {
            nip: userInfo.data.nip,
          },
        });
        if (user) {
          user.update({
            name: userInfo.data.name,
            email: userInfo.data.email,
            kode_kl: userInfo.data.kode_kl,
            nama_kl: userInfo.data.nama_kl,
            nip: userInfo.data.nip,
            jabatan: userInfo.data.jabatan,
            jenis_jabatan: userInfo.data.jenis_jabatan,
            kode_organisasi: userInfo.data.kode_organisasi,
            organisasi: userInfo.data.organisasi,
            kode_satker: userInfo.data.kode_satker,
            satker: userInfo.data.satker,
            gravatar: userInfo.data.gravatar,
            preferred_username: userInfo.data.preferred_username,
            nik: userInfo.data.g2c_Nik,
            npwp: userInfo.data.g2c_Npwp,
          });
          cb(null, user);
        } else {
          const res = await User.create({
            name: userInfo.data.name,
            email: userInfo.data.email,
            kode_kl: userInfo.data.kode_kl,
            nama_kl: userInfo.data.nama_kl,
            nip: userInfo.data.nip,
            jabatan: userInfo.data.jabatan,
            jenis_jabatan: userInfo.data.jenis_jabatan,
            kode_organisasi: userInfo.data.kode_organisasi,
            organisasi: userInfo.data.organisasi,
            kode_satker: userInfo.data.kode_satker,
            satker: userInfo.data.satker,
            gravatar: userInfo.data.gravatar,
            preferred_username: userInfo.data.preferred_username,
            nik: userInfo.data.g2c_Nik,
            npwp: userInfo.data.g2c_Npwp,
          });
          cb(null, res);
        }
      } catch (error) {
        cb(error, false, { message: error });
      }
    }
  )
);
passport.serializeUser((user: Express.User, done) => {
  done(null, user.sub);
});
passport.deserializeUser(async (sub: string, done) => {
  User.findOne({ where: { sub: sub } }).then(async (user) => {
    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  });
});

export default passport;
