import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const passportConfig = {
  BASE_URI: process.env.SSO_BASE_URI || "",
  AUTHORIZE_ENDPOINT: process.env.SSO_AUTHORIZE_ENDPOINT || "",
  TOKEN_ENDPOINT: process.env.SSO_TOKEN_ENDPOINT || "",
  REDIRECT_URI: process.env.SSO_REDIRECT_URI || "",
  ENDSESSION_ENDPOINT: process.env.SSO_ENDSESSION_ENDPOINT || "",
  USERINFO_ENDPOINT: process.env.SSO_USERINFO_ENDPOINT || "",
  SCOPE: process.env.SSO_SCOPE || "",
  CLIENT_ID: process.env.SSO_CLIENT_ID_FILE
    ? fs.readFileSync(process.env.SSO_CLIENT_ID_FILE, "utf8").trim()
    : process.env.SSO_CLIENT_ID || "",
  CLIENT_SECRET: process.env.SSO_CLIENT_SECRET_FILE
    ? fs.readFileSync(process.env.SSO_CLIENT_SECRET_FILE, "utf8").trim()
    : process.env.SSO_CLIENT_SECRET || "",
};
