import { passportConfig } from "@/config/passport.config";
import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";
import User from "../models/User.model";
import axios from "axios";
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
        const profile = await KemenkeuService.getProfilHris2({
          nip: userInfo.data.nip,
        });

        const user = await User.findOne({
          where: {
            nip: profile.nip18,
          },
        });
        if (user) {
          await user.update({
            name: profile.nama,
            email: profile.email,
            kode_kl: userInfo.data.kode_kl,
            nama_kl: userInfo.data.nama_kl,
            nip: profile.nip18,
            jabatan:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.namaJabatan || profile.jabatan[0].namaJabatan,
            jenis_jabatan:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.jenisJabatan || profile.jabatan[0].jenisJabatan,
            kode_organisasi:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.kodeOrganisasi || profile.jabatan[0].kodeOrganisasi,
            organisasi:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.organisasi || profile.jabatan[0].organisasi,
            kode_satker: profile.kdSatker,
            satker: profile.namaSatker,
            gravatar: userInfo.data.gravatar,
            preferred_username: userInfo.data.preferred_username,
            nik: profile.nik,
            npwp: profile.npwp.replace(/\D/g, ""),
          });
          cb(null, user);
        } else {
          const res = await User.create({
            name: profile.nama,
            email: profile.email,
            kode_kl: userInfo.data.kode_kl,
            nama_kl: userInfo.data.nama_kl,
            nip: profile.nip18,
            jabatan:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.namaJabatan || profile.jabatan[0].namaJabatan,
            jenis_jabatan:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.jenisJabatan || profile.jabatan[0].jenisJabatan,
            kode_organisasi:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.kodeOrganisasi || profile.jabatan[0].kodeOrganisasi,
            organisasi:
              profile.jabatan.find(
                (j) => j.statusJabatan.toLocaleLowerCase() === "definitif"
              )?.organisasi || profile.jabatan[0].organisasi,
            kode_satker: profile.kdSatker,
            satker: profile.namaSatker,
            gravatar: userInfo.data.gravatar,
            preferred_username: userInfo.data.preferred_username,
            nik: profile.nik,
            npwp: profile.npwp.replace(/\D/g, ""),
          });
          cb(null, res);
        }
      } catch (error) {
        cb(error, false, { message: error });
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.sub);
});
passport.deserializeUser(async (sub: string, done) => {
  await User.findOne({ where: { sub: sub } }).then(async (user) => {
    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  });
});

export default passport;
