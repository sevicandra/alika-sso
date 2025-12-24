import { Role } from "@/repositories";
import { successResponse } from "@/helpers/respose.helper";
import { Response, Request } from "express";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const RoleControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);

    const { items: data, pagination } = await Role.findAllWithPagination({
      limit,
      offset,
      order,
    });
    successResponse(res, "Success get all roles", data, pagination);
  }),
};
