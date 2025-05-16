import axios from "axios";
import { ServiceKemenkeuConfig } from "@/config/serviceKemenkeu.config";
import { appConfig } from "@/config/app.config";
import { RedisService } from "./redis.service";
const redis = new RedisService();

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
      console.error("Error requesting OAuth2 token:", error);
      throw new Error("Failed to get access token");
    }
  }
  static async getProfil({ nip }: { nip: string }): Promise<any> {
    try {
      const cachedProfil = await redis.getCache(
        `${appConfig.NAME}:KemenkeuService:Profil:${nip}`
      );
      if (cachedProfil) {
        return JSON.parse(cachedProfil);
      }
      const response = await axios.get(
        `${ServiceKemenkeuConfig.BASE_URI}/hris/profil/Pegawai/GetByNip/${nip}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
        }
      );
      await redis.setCache(
        `${appConfig.NAME}:KemenkeuService:Profil:${nip}`,
        JSON.stringify(response.data.Data),
        3600
      );
      return response.data.Data;
    } catch (error) {
      console.error("Error requesting Profil:", error);
      throw new Error("Failed to get Profil");
    }
  }
  static async getKeluarga({ nip }: { nip: string }): Promise<any> {
    try {
        const cachedKeluarga = await redis.getCache(
          `${appConfig.NAME}:KemenkeuService:Keluarga:${nip}`
        );
        if (cachedKeluarga) {
          return JSON.parse(cachedKeluarga);
        }
        const response = await axios.get(
          `${ServiceKemenkeuConfig.BASE_URI}/hris/keluarga/Riwayat/GetKeluargaByNip/${nip}`,
          {
            headers: {
              Authorization: `Bearer ${await this.getAccessToken()}`,
            },
          }
        );
        await redis.setCache(
          `${appConfig.NAME}:KemenkeuService:Keluarga:${nip}`,
          JSON.stringify(response.data.Data),
          3600
        );
        return response.data.Data;
      } catch (error) {
        console.error("Error requesting Profil:", error);
        throw new Error("Failed to get Profil");
      }
  }
}
