import { Transaction } from "sequelize";
import { NotFoundError } from "@/utils/errors";
import { handleSequelizeError } from "@/utils/errors/sequelize-error-handler";
import { Service } from "@/models";
import { Role, Scope } from "@/repositories";
import { BaseRepository } from "./base-repository";

export class ServiceRepository extends BaseRepository<Service> {
  constructor() {
    super(Service);
  }

  async getRoles(ServiceId: string) {
    try {
      const data = await this.findById(ServiceId, {
        include: [
          {
            association: "Roles",
          },
        ],
      });

      if (!data) {
        throw new NotFoundError("Service not found");
      }

      return data.Roles;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async addRole(
    ServiceId: string,
    payload: { role: string; kode: string; description?: string },
    t: Transaction
  ) {
    try {
      const service = await Service.findByPk(ServiceId, {
        transaction: t,
      });

      if (!service) {
        throw new NotFoundError("Service not found");
      }

      const data = await Role.create(
        {
          service_kode: service.kode,
          role: payload.role,
          kode: payload.kode,
          description: payload.description,
        },
        {
          transaction: t,
        }
      );

      if (!data) {
        throw new NotFoundError("Service not found");
      }
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async removeRole(ServiceId: string, roleId: string, t: Transaction): Promise<number> {
    try {
      const service = await Service.findByPk(ServiceId, {
        transaction: t,
      });

      if (!service) {
        throw new NotFoundError("Service not found");
      }

      return await Role.deleteOne(
        {
          where: {
            service_kode: service.kode,
            id: roleId,
          },
        },
        t
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async getScopes(ServiceId: string) {
    try {
      const data = await this.findById(ServiceId, {
        include: [
          {
            association: "Scopes",
          },
        ],
      });

      if (!data) {
        throw new NotFoundError("Service not found");
      }

      return data.Scopes;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async addScope(ServiceId: string, payload: { scope: string; kode: string }, t: Transaction) {
    try {
      const service = await Service.findByPk(ServiceId, {
        transaction: t,
      });

      if (!service) {
        throw new NotFoundError("Service not found");
      }

      const data = await Scope.create(
        {
          service_kode: service.kode,
          scope: payload.scope,
          kode: payload.kode,
        },
        {
          transaction: t,
        }
      );
      return data;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }

  async removeScope(ServiceId: string, scopeId: string, t: Transaction): Promise<number> {
    try {
      const service = await Service.findByPk(ServiceId, {
        transaction: t,
      });

      if (!service) {
        throw new NotFoundError("Service not found");
      }
      return await Scope.deleteOne(
        {
          where: {
            service_kode: service.kode,
            id: scopeId,
          },
        },
        t
      );
    } catch (error) {
      throw handleSequelizeError(error);
    }
  }
}
