import { UserAssignments, UserRole } from "@/repositories";
import { successResponse } from "@/helpers/respose.helper";
import { Response, Request } from "express";
import { Op, col } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const UserControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const search = req.query.search || undefined;
    const where: any = {
      service_kode: "002",
    };
    if (search)
      where[Op.or] = [
        where(col("nama"), { [Op.like]: `%${search}%` }),
        where(col("nip"), { [Op.like]: `%${search}%` }),
      ];

    const { items: data, pagination } =
      await UserAssignments.findAllWithPagination({
        where,
        limit,
        offset,
        order,
      });
    successResponse(res, "Success get all user", data, pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { UserId } = req.params;
    const data = await UserAssignments.findOne({
      where: {
        id: UserId,
        service_kode: "002",
      },
    });
    if (!data) {
      throw new NotFoundError("User not found");
    }
    successResponse(res, "Success get user", data);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const { nip, nama } = req.body;
    const data = await UserAssignments.create({
      nip,
      nama,
      service_kode: "002",
    });
    successResponse(res, "Success create user", data);
  }),
  update: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { UserId } = req.params;
      const { nip, nama } = req.body;
      const data = await UserAssignments.updateOne(
        {
          where: {
            id: UserId,
            service_kode: "002",
          },
        },
        {
          nip,
          nama,
        },
        t
      );
      successResponse(res, "Success update user", data);
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
      const { UserId } = req.params;
      await UserAssignments.deleteOne(
        {
          where: {
            id: UserId,
            service_kode: "002",
          },
        },
        t
      );
      successResponse(res, "Success delete user", null);
    },
    {
      useTransaction: true,
    }
  ),
  getRoles: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { UserId } = req.params;

      const user = await UserAssignments.findOne({
        where: {
          id: UserId,
          service_kode: "002",
        },
      });
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const { items: data, pagination } = await UserRole.findAllWithPagination({
        where: {
          user_id: UserId,
        },
        transaction: t,
      });
      successResponse(res, "Success get all role", data, pagination);
    },
    {
      useTransaction: true,
    }
  ),
  addRole: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { UserId } = req.params;
      const { role } = req.body;
      const user = await UserAssignments.findOne({
        where: {
          id: UserId,
          service_kode: "002",
        },
      });
      if (!user) {
        throw new NotFoundError("User not found");
      }
      const data = await UserRole.create(
        {
          user_id: UserId,
          role_kode: role,
        },
        {
          transaction: t,
        }
      );
      successResponse(res, "Success add role", data);
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
      const { UserId, role } = req.params;
      const user = await UserAssignments.findOne({
        where: {
          id: UserId,
          service_kode: "002",
        },
      });
      if (!user) {
        throw new NotFoundError("User not found");
      }
      await UserRole.deleteOne(
        {
          where: {
            user_id: UserId,
            role_kode: role,
          },
        },
        t
      );
      successResponse(res, "Success remove role", null);
    },
    {
      useTransaction: true,
    }
  ),
};
