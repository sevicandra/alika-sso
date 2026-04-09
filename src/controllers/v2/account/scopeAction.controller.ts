import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { ScopeAction } from "@/repositories";

export const ScopeActionControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const search = req.query.search || undefined;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    const { items: data, pagination } = await ScopeAction.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });
    successResponse(
      res,
      "Success get all scope action",
      data.map((item) => ({
        id: item.id,
        kode: item.kode,
        name: item.name,
        description: item.description,
      })),
      pagination
    );
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { ScopeActionId } = req.params;
    if (typeof ScopeActionId !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await ScopeAction.findById(ScopeActionId);
    if (!data) {
      throw new NotFoundError("Scope action not found");
    }
    successResponse(res, "Success get scope action", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { kode, name, description } = req.body;

    const data = await ScopeAction.create({
      kode,
      name,
      description,
    });
    successResponse(res, "Success create scope action", data);
  }),
  update: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ScopeActionId } = req.params;
      const { kode, name, description } = req.body;
      const data = await ScopeAction.updateOne(
        {
          where: {
            id: ScopeActionId,
          },
        },
        {
          kode,
          name,
          description,
        },
        t
      );
      successResponse(res, "Success update scope action", data);
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
      const { ScopeActionId } = req.params;
      await ScopeAction.deleteOne(
        {
          where: {
            id: ScopeActionId,
          },
        },
        t
      );
      successResponse(res, "Success delete scope action", null);
    },
    {
      useTransaction: true,
    }
  ),
};
