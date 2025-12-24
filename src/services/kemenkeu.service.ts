import axios from "axios";
import { ServiceKemenkeuConfig } from "@/config/serviceKemenkeu.config";
import { appConfig } from "@/config/app.config";
import { redisService } from "@/services/redis-service";
import { Keluarga, Profile, Profile2 } from "@/types/serviceKemenkeu";
import { ExternalServiceError } from "@/utils/errors";
import logger from "@/utils/Logger.utils";

export class KemenkeuService {
  private static token: string | null = null;
  private static tokenExpiration: number = 0;
  static async getAccessToken(): Promise<string> {
    const currentTime = Date.now() / 1000;
    if (this.token && currentTime < this.tokenExpiration) {
      return this.token;
    }
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
        }
      );

      this.token = response.data.access_token as string;
      this.tokenExpiration = currentTime + response.data.expires_in;
      return this.token;
    } catch (error) {
      logger.error("Failed to get access token", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ExternalServiceError(
        "KemenkeuService",
        "Failed to get access token"
      );
    }
  }
  static async getProfil({ nip }: { nip: string }): Promise<Profile> {
    try {
      const cachedProfil = await redisService.get<Profile>(
        `${appConfig.NAME}:KemenkeuService:Profil:${nip}`
      );
      if (cachedProfil) {
        return cachedProfil;
      }
      const response = await axios.get(
        `${ServiceKemenkeuConfig.BASE_URI}/hris/profil/Pegawai/GetByNip/${nip}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
        }
      );
      await redisService.setWithTimeout(
        `${appConfig.NAME}:KemenkeuService:Profil:${nip}`,
        JSON.stringify(response.data.Data),
        3600
      );
      return response.data.Data as Profile;
    } catch (error) {
      logger.error("Failed to get access token", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ExternalServiceError("KemenkeuService", "Failed to get Profil");
    }
  }
  static async getKeluarga({ nip }: { nip: string }): Promise<Keluarga[]> {
    try {
      const cachedKeluarga = await redisService.get<Keluarga[]>(
        `${appConfig.NAME}:KemenkeuService:Keluarga:${nip}`
      );
      if (cachedKeluarga) {
        return cachedKeluarga;
      }
      const response = await axios.get(
        `${ServiceKemenkeuConfig.BASE_URI}/hris/keluarga/Riwayat/GetKeluargaByNip/${nip}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
        }
      );
      await redisService.setWithTimeout(
        `${appConfig.NAME}:KemenkeuService:Keluarga:${nip}`,
        JSON.stringify(response.data.Data),
        3600
      );
      return response.data.Data as Keluarga[];
    } catch (error) {
      logger.error("Failed to get access token", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error("Failed to get Keluarga");
    }
  }
  static async getProfilHris2({ nip }: { nip: string }): Promise<Profile2> {
    try {
      const cachedProfil = await redisService.get<Profile2>(
        `${appConfig.NAME}:KemenkeuService:Profil2:${nip}`
      );
      if (cachedProfil) {
        return cachedProfil;
      }
      const response = await axios.get(
        `${ServiceKemenkeuConfig.BASE_URI2}/HrisProfil/2.0/api/Profile/GetPegawai?nip=${nip}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
        }
      );
      await redisService.setWithTimeout(
        `${appConfig.NAME}:KemenkeuService:Profil2:${nip}`,
        JSON.stringify(response.data.data),
        3600
      );
      return response.data.data;
    } catch (error) {
      logger.error("Failed to get access token", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ExternalServiceError("KemenkeuService", "Failed to get Profil");
    }
  }
}
