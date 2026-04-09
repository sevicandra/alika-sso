import { Request, Response } from "express";
import { Op } from "sequelize";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { InvalidRequestError, NotFoundError } from "@/utils/errors";
import { successResponse } from "@/helpers/respose.helper";
import { sortBuilder } from "@/helpers/sequelizer.helper";
import { Client, ClientGrant, ClientScope, RedirectUri } from "@/repositories";

export const ClientControllerV2 = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const where: any = {};
    const search = req.query.search || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    if (search)
      where.client_id = {
        [Op.like]: `%${search}%`,
      };

    const data = await Client.findAllWithPagination({
      where,
      limit,
      offset,
      order,
    });

    successResponse(res, "Success get all clients", data.items, data.pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { ClientId } = req.params;
    if (typeof ClientId !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await Client.findById(ClientId, {
      include: [
        {
          association: "GrantTypes",
          attributes: ["grant"],
        },
        {
          association: "RedirectUris",
          attributes: ["uri"],
        },
        {
          association: "Scopes",
        },
      ],
    });

    if (!data) {
      throw new NotFoundError("Client not found");
    }

    successResponse(res, "Success get client", data);
  }),

  create: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;

      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }

      const { client_id, client_secret } = req.body;

      const data = await Client.create(
        {
          client_id,
          client_secret,
        },
        {
          transaction: t,
        }
      );

      successResponse(res, "Success create client", {
        client_id: data.client_id,
      });
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

      const { client_id, client_secret } = req.body;
      const { ClientId } = req.params;
      if (typeof ClientId !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await Client.updateById(
        ClientId,
        {
          client_id,
          client_secret,
        },
        t
      );

      successResponse(res, "Success update client", {
        client_id: data.client_id,
      });
    },
    {
      useTransaction: true,
    }
  ),

  delete: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      const { ClientId } = req.params;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      if (typeof ClientId !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      await Client.deleteById(ClientId, t);
      successResponse(res, "Success delete client", {
        ClientId,
      });
    },
    {
      useTransaction: true,
    }
  ),

  getScopes: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const search = req.query.search || undefined;
    const sort = (req.query.sort as string) || undefined;
    const order = sortBuilder(sort);
    const { ClientId } = req.params;
    const where: any = {
      client_id: ClientId,
    };
    if (search) where.name = { [Op.like]: `%${search}%` };
    const data = await ClientScope.findAllWithPagination({
      where,
      limit,
      offset,
      order,
      include: [
        {
          association: "Scope",
          include: [
            {
              association: "Service",
            },
          ],
        },
        {
          association: "Action",
        },
      ],
    });
    successResponse(
      res,
      "Success get scopes",
      data.items.map((item) => ({
        id: item.id,
        service: item.Scope.Service.name,
        scope: item.Scope.scope,
        action: item.Action.name,
      })),
      data.pagination
    );
  }),

  getScopeById: asyncHandler(async (req: Request, res: Response) => {
    const { ClientId, ScopeId } = req.params;
    const data = await ClientScope.findOne({
      where: {
        id: ScopeId,
        client_id: ClientId,
      },
    });

    if (!data) {
      throw new NotFoundError("Scope not found");
    }
    successResponse(res, "Success get scope", {
      id: data.id,
      service_kode: data.Scope.Service.kode,
      action_kode: data.Action.kode,
      scope_id: data.Scope.id,
    });
  }),

  createScope: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ClientId } = req.params;
      const { scope_id, action_kode } = req.body;
      if (typeof ClientId !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await ClientScope.create(
        {
          client_id: ClientId,
          scope_id: scope_id,
          action_kode,
        },
        {
          transaction: t,
        }
      );
      successResponse(res, "Success create scope", data);
    },
    {
      useTransaction: true,
    }
  ),

  updateScope: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ClientId, ScopeId } = req.params;
      const { scope_id, action_kode } = req.body;
      const data = await ClientScope.updateOne(
        {
          where: {
            id: ScopeId,
            client_id: ClientId,
          },
        },
        {
          scope_id: scope_id,
          action_kode: action_kode,
        },
        t
      );
      successResponse(res, "Success update scope", data);
    },
    {
      useTransaction: true,
    }
  ),

  removeScope: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ClientId, ScopeId } = req.params;
      await ClientScope.deleteOne(
        {
          where: {
            id: ScopeId,
            client_id: ClientId,
          },
        },
        t
      );
      successResponse(res, "Success remove scope", null);
    },
    {
      useTransaction: true,
    }
  ),

  getGrants: asyncHandler(async (req: Request, res: Response) => {
    const { ClientId } = req.params;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = (req.query.sort as string) || undefined;
    const order = sortBuilder(sort);
    const where: any = {
      client_id: ClientId,
    };
    const { items: data, pagination } = await ClientGrant.findAllWithPagination({
      where,
      limit,
      offset,
      order,
      include: [
        {
          association: "Grant",
        },
      ],
    });
    successResponse(
      res,
      "Success get grants",
      data.map((item) => ({
        id: item.id,
        kode: item.Grant.kode,
        grant: item.Grant.grant,
      })),
      pagination
    );
  }),

  getGrantById: asyncHandler(async (req: Request, res: Response) => {
    const { ClientId, GrantId } = req.params;
    const data = await ClientGrant.findOne({
      where: {
        id: GrantId,
        client_id: ClientId,
      },
    });
    if (!data) {
      throw new NotFoundError("Grant not found");
    }
    successResponse(res, "Success get grant", data);
  }),

  createGrant: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ClientId } = req.params;
      const { grant_kode } = req.body;
      if (typeof ClientId !== "string") {
        throw new InvalidRequestError("Invalid request");
      }
      const data = await ClientGrant.create(
        {
          client_id: ClientId,
          grant_kode: grant_kode,
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

  removeGrant: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ClientId, GrantId } = req.params;
      await ClientGrant.deleteOne(
        {
          where: {
            id: GrantId,
            client_id: ClientId,
          },
        },
        t
      );
      successResponse(res, "Success remove grant", null);
    },
    {
      useTransaction: true,
    }
  ),

  getRedirects: asyncHandler(async (req: Request, res: Response) => {
    const { ClientId } = req.params;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = parseInt(req.query.offset as string) || undefined;
    const sort = req.query.sort as string;
    const order = sortBuilder(sort);
    const { items: data, pagination } = await RedirectUri.findAllWithPagination({
      where: {
        client_id: ClientId,
      },
      limit,
      offset,
      order,
    });
    successResponse(res, "Success get redirect", data, pagination);
  }),

  getRedirectById: asyncHandler(async (req: Request, res: Response) => {
    const { ClientId, RedirectId } = req.params;
    const data = await RedirectUri.findOne({
      where: {
        id: RedirectId,
        client_id: ClientId,
      },
    });
    if (!data) {
      throw new NotFoundError("Redirect not found");
    }
    successResponse(res, "Success get redirect", data);
  }),

  createRedirect: asyncHandler(async (req: Request, res: Response) => {
    const { ClientId } = req.params;
    const { uri } = req.body;
    if (typeof ClientId !== "string") {
      throw new InvalidRequestError("Invalid request");
    }
    const data = await RedirectUri.create({
      client_id: ClientId,
      uri: uri,
    });
    successResponse(res, "Success create redirect", data);
  }),

  updateRedirect: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ClientId, RedirectId } = req.params;
      const { uri } = req.body;
      const data = await RedirectUri.updateOne(
        {
          where: {
            id: RedirectId,
            client_id: ClientId,
          },
        },
        {
          uri: uri,
        },
        t
      );
      successResponse(res, "Success update redirect", data);
    },
    {
      useTransaction: true,
    }
  ),

  removeRedirect: asyncHandler(
    async (req: Request, res: Response) => {
      const t = req.transaction;
      if (!t) {
        throw new InvalidRequestError("Transaksi tidak ditemukan");
      }
      const { ClientId, RedirectId } = req.params;
      await RedirectUri.deleteOne(
        {
          where: {
            id: RedirectId,
            client_id: ClientId,
          },
        },
        t
      );
      successResponse(res, "Success remove redirect", null);
    },
    {
      useTransaction: true,
    }
  ),
};
