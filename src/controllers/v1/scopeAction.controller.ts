import { Response, Request } from "express";
import { ScopeAction } from "@/repositories";
import { Op } from "sequelize";
import { successResponse } from "@/helpers/respose.helper";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError } from "@/utils/errors";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const ScopeActionControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const where: any = {};
    const search = req.query.search || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
        const sort = req.query.sort as string;
        const order = sortBuilder(sort);
    if (search)
      where.name = {
        [Op.like]: `%${search}%`,
      };

    const data = await ScopeAction.findAllWithPagination({
      where,
      limit,
      offset,
      order
    });

    successResponse(
      res,
      "Success get all clients",
      data.items,
      data.pagination
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await ScopeAction.findById(id);

    successResponse(res, "Success get client by id", data);
  }),

  create: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;

      if (!t) {
        throw new InvalidRequestError("Transaction not found");
      }
      const { kode, name, description } = req.body;
      const data = await ScopeAction.create({
        kode,
        name,
        description,
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
    const { name, description } = req.body;
    const data = await ScopeAction.updateById(id, t, {
      name,
      description,
    });
    successResponse(res, "Success update client", data);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const t = req.transaction;
    if (!t) {
      throw new InvalidRequestError("Transaction not found");
    }
    const id = req.params.id;
    await ScopeAction.deleteById(id, {
      transaction: t,
    });
    successResponse(res, "Success delete client", { id });
  }),
};
