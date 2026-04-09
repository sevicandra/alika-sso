import axios from "axios";
import { redisService } from "@/services/redis-service";
import logger from "@/utils/Logger.utils";
import {
  AuthenticationError,
  ExternalServiceError,
  NotFoundError,
  TimeoutError,
} from "@/utils/errors";
import { appConfig } from "@/config/app.config";
import { ServiceKemenkeuConfig } from "@/config/serviceKemenkeu.config";
import { Keluarga, Profile, Profile2 } from "@/types/serviceKemenkeu";

const API_TIMEOUT = 5000;

export class KemenkeuService {
  private static token: string | null = null;
  private static tokenExpiration: number = 0;
  private static tokenRefreshPromise: Promise<string> | null = null;
  private static readonly TOKEN_BUFFER_SECONDS = 30;

  static async getAccessToken(): Promise<string> {
    const currentTime = Date.now() / 1000;
    const bufferSeconds = this.TOKEN_BUFFER_SECONDS;

    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    if (this.token && currentTime < this.tokenExpiration - bufferSeconds) {
      return this.token;
    }

    this.tokenRefreshPromise = this._refreshToken();
    try {
      return await this.tokenRefreshPromise;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private static async _refreshToken(): Promise<string> {
    try {
      const response = await axios.postForm(
        ServiceKemenkeuConfig.TOKEN_URI,
        {
          grant_type: ServiceKemenkeuConfig.GRANT_TYPE,
          client_id: ServiceKemenkeuConfig.CLIENT_ID,
          client_secret: ServiceKemenkeuConfig.CLIENT_SECRET,
          scope: ServiceKemenkeuConfig.SCOPE,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: API_TIMEOUT,
        }
      );
      this.token = response.data.access_token as string;
      this.tokenExpiration = Date.now() / 1000 + response.data.expires_in;
      return this.token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          logger.error("Token API timeout");
          throw new TimeoutError("Kemenkeu Token Service");
        }
        if (error.response?.status === 401) {
          logger.error("Token API authentication failed");
          throw new AuthenticationError("Kemenkeu service authentication failed");
        }
      }

      logger.error("Failed to refresh access token", {
        error: error instanceof Error ? error.message : String(error),
      });

      throw new ExternalServiceError("KemenkeuService", "Failed to get access token");
    }
  }

  static async getProfil({ nip }: { nip: string }): Promise<Profile> {
    try {
      const cacheKey = `${appConfig.NAME}:KemenkeuService:Profil:${nip}`;
      const cachedProfil = await redisService.get<Profile>(cacheKey);
      if (cachedProfil) {
        return cachedProfil;
      }

      const response = await axios.get(
        `${ServiceKemenkeuConfig.BASE_URI}/hris/profil/Pegawai/GetByNip/${nip}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
          timeout: API_TIMEOUT,
        }
      );

      if (!response.data?.Data) {
        throw new ExternalServiceError("KemenkeuService", "Invalid Profil response format");
      }

      const profil = response.data.Data as Profile;

      await redisService.setWithTimeout(cacheKey, profil, 3600);

      return profil;
    } catch (error) {
      if (
        error instanceof ExternalServiceError ||
        error instanceof TimeoutError ||
        error instanceof AuthenticationError
      ) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          logger.error("Profil API timeout", { nip });
          throw new TimeoutError("Kemenkeu Profil Service");
        }
        if (error.response?.status === 404) {
          logger.warn("Profil not found", { nip });
          throw new NotFoundError(`Profile for NIP: ${nip}`);
        }
      }

      logger.error("Failed to get Profil from Kemenkeu", {
        nip,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new ExternalServiceError("KemenkeuService", "Failed to get Profil");
    }
  }

  static async getKeluarga({ nip }: { nip: string }): Promise<Keluarga[]> {
    try {
      const cacheKey = `${appConfig.NAME}:KemenkeuService:Keluarga:${nip}`;
      const cachedKeluarga = await redisService.get<Keluarga[]>(cacheKey);
      if (cachedKeluarga) {
        return cachedKeluarga;
      }

      const response = await axios.get(
        `${ServiceKemenkeuConfig.BASE_URI}/hris/keluarga/Riwayat/GetKeluargaByNip/${nip}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
          timeout: API_TIMEOUT,
        }
      );

      if (!response.data?.Data) {
        throw new ExternalServiceError("KemenkeuService", "Invalid Keluarga response format");
      }

      const keluarga = response.data.Data as Keluarga[];

      await redisService.setWithTimeout(cacheKey, keluarga, 3600);

      return keluarga;
    } catch (error) {
      if (
        error instanceof ExternalServiceError ||
        error instanceof TimeoutError ||
        error instanceof AuthenticationError
      ) {
        throw error;
      }

      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        logger.error("Keluarga API timeout", { nip });
        throw new TimeoutError("Kemenkeu Keluarga Service");
      }

      logger.error("Failed to get Keluarga from Kemenkeu", {
        nip,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new ExternalServiceError("KemenkeuService", "Failed to get Keluarga");
    }
  }

  static async getProfilHris2({ nip }: { nip: string }): Promise<Profile2> {
    try {
      const cacheKey = `${appConfig.NAME}:KemenkeuService:Profil2:${nip}`;
      const cachedProfil = await redisService.get<Profile2>(cacheKey);
      if (cachedProfil) {
        return cachedProfil;
      }

      const response = await axios.get(
        `${ServiceKemenkeuConfig.BASE_URI2}/HrisProfil/2.0/api/Profile/GetPegawai?nip=${nip}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
          timeout: API_TIMEOUT,
        }
      );

      if (!response.data?.data) {
        throw new ExternalServiceError("KemenkeuService", "Invalid Profil2 response format");
      }

      const profil = response.data.data as Profile2;

      await redisService.setWithTimeout(cacheKey, profil, 3600);

      return profil;
    } catch (error) {
      if (
        error instanceof ExternalServiceError ||
        error instanceof TimeoutError ||
        error instanceof AuthenticationError
      ) {
        throw error;
      }

      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        logger.error("Profil2 API timeout", { nip });
        throw new TimeoutError("Kemenkeu Profil2 Service");
      }

      logger.error("Failed to get Profil2 from Kemenkeu", {
        nip,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new ExternalServiceError("KemenkeuService", "Failed to get Profil");
    }
  }
}
