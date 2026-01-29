import { Grant } from "@/repositories";
import { successResponse } from "@/helpers/respose.helper";
import { Response, Request } from "express";
import { Op, col } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const GrantControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const search = req.query.search || undefined;
    const service = req.query.service || undefined;
    const where: any = {};
    if (search) where.nama = { [Op.like]: `%${search}%` };
    if (service) where.push(where(col("Service.name"), { [Op.like]: `%${search}%` }));
    const { items: data, pagination } = await Grant.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });
    successResponse(res, "Success get all grants", data, pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { GrantId } = req.params;
    if (typeof GrantId !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await Grant.findById(GrantId);
    if (!data) {
      throw new NotFoundError("Grant not found");
    }
    successResponse(res, "Success get grant", data);
  }),
  create: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { kode, grant } = req.body;
      const data = await Grant.create(
        {
          kode,
          grant,
        },
        {
          transaction: t,
        }
      );
      successResponse(res, "Success create grant", data);
    },
    {
      useTransaction: true,
    }
  ),
  update: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { GrantId } = req.params;
      const { kode, grant } = req.body;
      const data = await Grant.updateOne(
        {
          where: {
            id: GrantId,
          },
        },
        {
          kode,
          grant,
        },
        t
      );
      successResponse(res, "Success update grant", data);
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
      const { GrantId } = req.params;
      await Grant.deleteOne(
        {
          where: {
            id: GrantId,
          },
        },
        t
      );
      successResponse(res, "Success delete grant", null);
    },
    {
      useTransaction: true,
    }
  ),
};
