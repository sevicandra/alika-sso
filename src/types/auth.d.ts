import { Request } from "express";

declare global {
  namespace Express {
    interface User {
      sub: string;
      name: string;
      nik: string;
      nip: string;
      kode_satker: string;
      satker: string;
      gravatar: string;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?:
    | {
        name: string;
        nik: string;
        nip: string;
        kode_satker: string;
        satker: string;
        gravatar: string;
      }
    | any;
  roles?: {
    kode_satker: string;
    roles: {
      kode: string;
      nama: string;
    }[];
  }[];
  globalRoles?: {
    kode: string;
    nama: string;
  }[];
  client?: {
    id: string;
    client_id: string;
    grant_types: string[];
    redirect_uris: string[];
    scopes: string[];
  };
}

export interface TokenRequest extends Request {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  client?: {
    id: string;
    client_id: string;
    grant_types: string[];
    redirect_uris: string[];
    scopes: string[];
  };
}

export interface CodeRequest extends Request {
  state?: string;
  scope?: string;
}

export interface access_token {
  sub?: string;
  clientId?: string;
  scope: string;
}

export interface user_access_token extends access_token {
  name: string;
  nik: string;
  nip: string;
  kode_satker: string;
  satker: string;
  gravatar: string;
  account: {
    kode_satker: string;
    roles: {
      kode: string;
      nama: string;
    }[];
  }[];
  globalRoles: {
    kode: string;
    nama: string;
  }[];
}

export interface refresh_token {
  id: string;
  token: string;
  sessionId?: string;
}
