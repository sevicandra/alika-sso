import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { Role } from "@/repositories";

export const RoleControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);

    const { items: data, pagination } = await Role.findAllWithPagination({
      where: {
        service_kode: "005",
      },
      limit,
      offset,
      order,
    });
    successResponse(res, "Success get all roles", data, pagination);
  }),
};
