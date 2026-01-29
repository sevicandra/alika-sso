import { Service, Role, Scope } from "@/repositories";
import { successResponse } from "@/helpers/respose.helper";
import { Response, Request } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const ServiceControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const search = req.query.search || undefined;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${search}%` };

    const { items: data, pagination } = await Service.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });
    successResponse(res, "Success get all data service", data, pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { ServiceKode } = req.params;
    const data = await Service.findOne({
      where: {
        kode: ServiceKode,
      },
    });
    if (!data) {
      throw new NotFoundError("Service not found");
    }
    successResponse(res, "Success get data service by id", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { kode, name, description } = req.body;
    const data = await Service.create({
      kode,
      name,
      description,
    });
    successResponse(res, "Success create data service", data);
  }),
  update: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ServiceKode } = req.params;
      const { kode, name, description } = req.body;
      const data = await Service.updateOne(
        {
          where: {
            kode: ServiceKode,
          },
        },
        {
          kode,
          name,
          description,
        },
        t
      );
      successResponse(res, "Success update data service", data);
    },
    {
      useTransaction: true,
    }
  ),
  delete: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ServiceKode } = req.params;
      await Service.deleteOne(
        {
          where: {
            kode: ServiceKode,
          },
        },
        t
      );
      successResponse(res, "Success delete data service", null);
    },
    {
      useTransaction: true,
    }
  ),

  getRoles: asyncHandler(async (req: Request, res: Response) => {
    const { ServiceKode } = req.params;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const search = req.query.search || undefined;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${search}%` };

    const { items: data, pagination } = await Role.findAllWithPagination({
      where: {
        service_kode: ServiceKode,
      },
      limit,
      offset,
      order,
    });
    successResponse(res, "Success get all data role", data, pagination);
  }),
  getRoleById: asyncHandler(async (req: Request, res: Response) => {
    const { ServiceKode, RoleKode } = req.params;
    const data = await Role.findOne({
      where: {
        kode: RoleKode,
        service_kode: ServiceKode,
      },
    });
    if (!data) {
      throw new NotFoundError("Role not found");
    }
    successResponse(res, "Success get role by id", data);
  }),
  addRole: asyncHandler(
    async (req: Request, res: Response) => {
      const { ServiceKode } = req.params;
      const { kode, role, description } = req.body;
      if (typeof ServiceKode !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await Role.create({
        kode,
        role,
        description,
        service_kode: ServiceKode,
      });
      successResponse(res, "Success create data role", data);
    },
    {
      useTransaction: true,
    }
  ),
  updateRole: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { kode, role, description } = req.body;
      const { RoleKode, ServiceKode } = req.params;
      const data = await Role.updateOne(
        {
          where: {
            kode: RoleKode,
            service_kode: ServiceKode,
          },
        },
        {
          kode,
          role,
          description,
        },
        t
      );
      successResponse(res, "Success update data role", data);
    },
    {
      useTransaction: true,
    }
  ),
  removeRole: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { RoleKode, ServiceKode } = req.params;
      await Role.deleteOne(
        {
          where: {
            kode: RoleKode,
            service_kode: ServiceKode,
          },
        },
        t
      );
      successResponse(res, "Success delete data role", null);
    },
    {
      useTransaction: true,
    }
  ),

  getScopes: asyncHandler(async (req: Request, res: Response) => {
    const { ServiceKode } = req.params;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const search = req.query.search || undefined;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    const { items: data, pagination } = await Scope.findAllWithPagination({
      where: {
        service_kode: ServiceKode,
      },
      limit,
      offset,
      order,
    });
    successResponse(res, "Success get all data scope", data, pagination);
  }),
  getScopeById: asyncHandler(async (req: Request, res: Response) => {
    const { ScopeKode, ServiceKode } = req.params;
    const data = await Scope.findOne({
      where: {
        kode: ScopeKode,
        service_kode: ServiceKode,
      },
    });
    if (!data) {
      throw new NotFoundError("Scope not found");
    }
    successResponse(res, "Success get data scope by id", data);
  }),
  addScope: asyncHandler(async (req: Request, res: Response) => {
    const { ServiceKode } = req.params;
    const { kode, scope } = req.body;
    if (typeof ServiceKode !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await Scope.create({
      kode,
      scope,
      service_kode: ServiceKode,
    });
    successResponse(res, "Success create data scope", data);
  }),
  updateScope: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { kode, scope } = req.body;
      const { ScopeKode, ServiceKode } = req.params;
      const data = await Scope.updateOne(
        {
          where: {
            kode: ScopeKode,
            service_kode: ServiceKode,
          },
        },
        {
          kode,
          scope,
        },
        t
      );
      successResponse(res, "Success update data scope", data);
    },
    {
      useTransaction: true,
    }
  ),
  removeScope: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ScopeKode, ServiceKode } = req.params;
      await Scope.deleteOne(
        {
          where: {
            kode: ScopeKode,
            service_kode: ServiceKode,
          },
        },
        t
      );
      successResponse(res, "Success delete data scope", null);
    },
    {
      useTransaction: true,
    }
  ),
};
