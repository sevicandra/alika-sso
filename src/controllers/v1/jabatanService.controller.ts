import { Response, Request } from "express";
import { JabatanService } from "@/repositories";
import { successResponse } from "@/helpers/respose.helper";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError, InternalServerError } from "@/utils/errors";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const JabatanServiceControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);

    const { items: data, pagination } = await JabatanService.findAllWithPagination({
      limit,
      offset,
      order,
    });

    successResponse(res, "success get all letter numbers", data, pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }

    const data = await JabatanService.findById(id);

    if (!data) {
      throw new NotFoundError(`Letter Number with id ${id}`);
    }
    successResponse(res, "success get letter number by id", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await JabatanService.create(req.body);
    successResponse(res, "success create letter number", data);
  }),
  import: asyncHandler(async (req: Request, res: Response) => {
    const records = req.body;

    await JabatanService.createBulk(records);
    successResponse(res, "success import letter number", records);
  }),
  update: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const { id } = req.params;
      if (typeof id !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await JabatanService.updateById(id, req.body);
      successResponse(res, "success update letter number", data);
    },
    {
      useTransaction: true,
    }
  ),
  delete: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InternalServerError("Transaction not found");
      }
      const { id } = req.params;
      if (typeof id !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await JabatanService.deleteById(id, t);
      successResponse(res, "success delete letter number", data);
    },
    {
      useTransaction: true,
    }
  ),
};
