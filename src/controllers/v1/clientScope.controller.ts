import { Response, Request } from "express";
import { ClientScope } from "@/repositories";
import { successResponse } from "@/helpers/respose.helper";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { sortBuilder } from "@/helpers/sequelizer.helper";

export const ClientScopeControllerV1 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);

    const data = await ClientScope.findAllWithPagination({
      limit,
      offset,
      order: order,
    });

    successResponse(res, "Success get all clients", data.items, data.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await ClientScope.findById(id);

    if (!data) {
      throw new NotFoundError("Client not found");
    }
    successResponse(res, "Success get client", data);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { action_kode, scopeId, clientId } = req.body;
    const data = await ClientScope.create({
      action_kode,
      scope_id: scopeId,
      client_id: clientId,
    });
    successResponse(res, "Success create client scope", data);
  }),
  update: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const id = req.params.id;
      if (typeof id !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const { action_kode, scopeId, clientId } = req.body;
      const data = await ClientScope.updateById(id, {
        action_kode,
        scope_id: scopeId,
        client_id: clientId,
      },t);
      successResponse(res, "Success update client scope", data);
    },
    {
      useTransaction: true,
    }
  ),
  delete: asyncHandler(async (req: Request, res: Response) => {
    const t = req.transaction;
    if (!t) {
      throw new InvalidRequestError("Transaction not found");
    }
    const id = req.params.id;
    if (typeof id !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    await ClientScope.deleteById(id, t);
    successResponse(res, "Success delete client", { id });
  }),
};
