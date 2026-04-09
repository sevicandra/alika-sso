import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { Role } from "@/repositories";

export const RoleControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const where: any = {};
    const search = req.query.search || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    if (search)
      where.grant = {
        [Op.like]: `%${search}%`,
      };

    const data = await Role.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all clients", data.items, data.pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await Role.findById(id);

    successResponse(res, "Success get client by id", data);
  }),

  create: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;

      if (!t) {
        throw new InvalidRequestError("Transaction not found");
      }
      const { kode, role, service_kode } = req.body;
      const data = await Role.create({
        kode,
        role,
        service_kode,
      });
      successResponse(res, "Success create client", data);
    },
    {
      useTransaction: true,
    }
  ),

  update: asyncHandler(async (req: Request, res: Response) => {
    const t = req.transaction;
    if (!t) {
      throw new InvalidRequestError("Transaction not found");
    }
    const id = req.params.id;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const { role, service_kode } = req.body;
    const data = await Role.updateById(
      id,
      {
        role,
        service_kode,
      },
      t
    );
    successResponse(res, "Success update client", data);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const t = req.transaction;
    if (!t) {
      throw new InvalidRequestError("Transaction not found");
    }
    const id = req.params.id;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    await Role.deleteById(id, t);
    successResponse(res, "Success delete client", { id });
  }),
};
