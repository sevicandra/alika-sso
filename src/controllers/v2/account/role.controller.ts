import { Role } from "@/repositories";
import { successResponse } from "@/helpers/respose.helper";
import { Response, Request } from "express";
import { Op, col } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const RoleControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const search = req.query.search || undefined;
    const service = req.query.service || undefined;
    const where: any = {};
    if (search) where.nama = { [Op.like]: `%${search}%` };
    if (service)
      where.push(where(col("Service.name"), { [Op.like]: `%${search}%` }));

    const { items: data, pagination } = await Role.findAllWithPagination({
      where,
      limit,
      offset,
      order,
      include: [
        {
          association: "Service",
        },
      ],
    });
    successResponse(
      res,
      "Success get all roles",
      data.map((item) => ({
        id: item.id,
        kode: item.kode,
        role: item.role,
        description: item.description,
        service: item.Service.name,
      })),
      pagination
    );
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { RoleId } = req.params;
    const data = await Role.findById(RoleId);
    if (!data) {
      throw new NotFoundError("Role not found");
    }
    successResponse(res, "Success get role", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { kode, role, description, service_kode } = req.body;
    const data = await Role.create({
      kode,
      role,
      description,
      service_kode,
    });
    successResponse(res, "Success create role", data);
  }),
  upadte: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { RoleId } = req.params;
      const { kode, role, description, service_kode } = req.body;
      const data = await Role.updateOne(
        {
          where: {
            id: RoleId,
          },
        },
        {
          kode,
          role,
          description,
          service_kode,
        },
        t
      );
      successResponse(res, "Success update role", data);
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
      const { RoleId } = req.params;
      await Role.deleteOne(
        {
          where: {
            id: RoleId,
          },
        },
        t
      );
      successResponse(res, "Success delete role", null);
    },
    {
      useTransaction: true,
    }
  ),
};
