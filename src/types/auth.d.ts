import { Request } from "express";
import { Client } from "@/models";
export interface AuthenticatedRequest extends Request {
  user?: any;
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