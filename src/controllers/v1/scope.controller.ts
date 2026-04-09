import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { Scope } from "@/repositories";

export const ScopeControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const where: any = {};
    const search = req.query.search || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    if (search)
      where.scope = {
        [Op.like]: `%${search}%`,
      };

    const data = await Scope.findAllWithPagination({
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
    const data = await Scope.findById(id);

    successResponse(res, "Success get client by id", data);
  }),

  create: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;

      if (!t) {
        throw new InvalidRequestError("Transaction not found");
      }
      const { kode, scope, service_kode } = req.body;
      const data = await Scope.create({
        kode,
        scope,
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
    const { scope, service_kode } = req.body;
    const data = await Scope.updateById(
      id,
      {
        scope,
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
    await Scope.deleteById(id, t);
    successResponse(res, "Success delete client", { id });
  }),
};
