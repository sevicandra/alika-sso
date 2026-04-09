import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { Grant, Role, Scope, ScopeAction, Service } from "@/repositories";

export const getScopeAction = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || undefined;
  const offset = parseInt(req.query.offset as string) || undefined;
  const sort = req.query.sort as string;
  const order = sortBuilder(sort);
  const search = (req.query.search as string) || "";
  const where: any = {};
  if (search) where.name = { [Op.like]: `%${search}%` };

  const { items: data, pagination } = await ScopeAction.findAllWithPagination({
    limit,
    offset,
    order,
    where,
  });

  successResponse(res, "Data berhasil diambil", data, pagination);
});

export const getGrant = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || undefined;
  const offset = parseInt(req.query.offset as string) || undefined;
  const sort = req.query.sort as string;
  const order = sortBuilder(sort);

  const { items: data, pagination } = await Grant.findAllWithPagination({
    limit,
    offset,
    order,
  });

  successResponse(res, "Data berhasil diambil", data, pagination);
});

export const getRole = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || undefined;
  const offset = parseInt(req.query.offset as string) || undefined;
  const sort = req.query.sort as string;
  const order = sortBuilder(sort);
  const search = (req.query.search as string) || "";
  const where: any = {};
  if (search) where.name = { [Op.like]: `%${search}%` };

  const { items: data, pagination } = await Role.findAllWithPagination({
    limit,
    offset,
    order,
    where,
  });

  successResponse(res, "Data berhasil diambil", data, pagination);
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || undefined;
  const offset = parseInt(req.query.offset as string) || undefined;
  const sort = req.query.sort as string;
  const order = sortBuilder(sort);
  const search = (req.query.search as string) || "";
  const where: any = {};
  if (search) where.name = { [Op.like]: `%${search}%` };

  const { items: data, pagination } = await Service.findAllWithPagination({
    limit,
    offset,
    order,
    where,
  });

  successResponse(res, "Data berhasil diambil", data, pagination);
});

export const getScope = asyncHandler(async (req: Request, res: Response) => {
  const { service_kode } = req.params;
  const limit = parseInt(req.query.limit as string) || undefined;
  const offset = parseInt(req.query.offset as string) || undefined;
  const sort = req.query.sort as string;
  const order = sortBuilder(sort);
  const search = (req.query.search as string) || "";
  const where: any = {};
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (service_kode) where.service_kode = service_kode;

  const { items: data, pagination } = await Scope.findAllWithPagination({
    limit,
    offset,
    order,
    where,
  });

  successResponse(res, "Data berhasil diambil", data, pagination);
});
