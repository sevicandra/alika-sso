// import { Response } from "express";
// import { AuthenticatedRequest } from "@/types/auth";
// import { GlobalRole } from "@/models";
// import { Op } from "sequelize";
// import { successResponse, errorResponse } from "@/helpers/respose.helper";
// import {
//   ValidationError,
//   UniqueConstraintError,
//   DatabaseError,
//   ConnectionError,
// } from "sequelize";
// import { AxiosError } from "axios";

// export const getAllGlobalRole = async (
//   req: AuthenticatedRequest,
//   res: Response
// ) => {
//   try {
//     const search = req.query.search || undefined;
//     const limit = parseInt(req.query.limit as string) || undefined;
//     const offset = parseInt(req.query.offset as string) || undefined;
//     const where: any = {};
//     if (search) where.role = { [Op.like]: `%${search}%` };
//     const order: any[] = [];
//     const sortField = (req.query.sortField as string) || "id";
//     const sortOrder = (req.query.sortOrder as string) || "ASC";
//     order.push([sortField, sortOrder.toUpperCase()]);
//     const globalRoles = await GlobalRole.findAll({
//       where,
//       order,
//       limit,
//       offset,
//     });

//     const count = await GlobalRole.count({
//       where,
//     });

//     return successResponse(res, "Success get all global role", globalRoles, {
//       limit,
//       offset,
//       total: count,
//       totalPages: limit ? Math.ceil(count / limit) : 1,
//     });
//   } catch (error: unknown) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof UniqueConstraintError
//     ) {
//       const parsedErrors = error.errors.map((err) => ({
//         field: err.path,
//         message: err.message,
//       }));
//       return errorResponse(res, "Validation gagal", parsedErrors, 422);
//     } else if (
//       error instanceof DatabaseError ||
//       error instanceof ConnectionError
//     ) {
//       const parsedErrors = error.message;
//       return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
//     } else if (error instanceof ConnectionError) {
//       const parsedErrors = { message: "Gagal terhubung ke database" };
//       return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
//     } else if (error instanceof AxiosError) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "isAxiosError" in error &&
//         (error as AxiosError).isAxiosError
//       ) {
//         const axiosError = error as AxiosError;
//         const statusCode = axiosError.response?.status || 500;
//         const message =
//           (axiosError.response?.data as { message?: string })?.message ||
//           axiosError.message ||
//           "Kesalahan pada permintaan eksternal";
//         const details = axiosError.response?.data || null;
//         return errorResponse(res, message, details, statusCode);
//       }
//       return errorResponse(res, "Terjadi kesalahan", null, 500);
//     } else if (error instanceof Error) {
//       const parsedErrors = { message: error.message };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     } else {
//       const parsedErrors = { message: "Kesalahan tidak diketahui" };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     }
//   }
// };

// export const getGlobalRoleById = async (
//   req: AuthenticatedRequest,
//   res: Response
// ) => {
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return errorResponse(res, "Missing required parameters", null, 400);
//     }
//     const globalRole = await GlobalRole.findByPk(id);
//     if (!globalRole) {
//       return errorResponse(res, "Global role not found", null, 404);
//     }
//     return successResponse(res, "Success get global role by id", globalRole);
//   } catch (error: unknown) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof UniqueConstraintError
//     ) {
//       const parsedErrors = error.errors.map((err) => ({
//         field: err.path,
//         message: err.message,
//       }));
//       return errorResponse(res, "Validation gagal", parsedErrors, 422);
//     } else if (
//       error instanceof DatabaseError ||
//       error instanceof ConnectionError
//     ) {
//       const parsedErrors = error.message;
//       return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
//     } else if (error instanceof ConnectionError) {
//       const parsedErrors = { message: "Gagal terhubung ke database" };
//       return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
//     } else if (error instanceof AxiosError) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "isAxiosError" in error &&
//         (error as AxiosError).isAxiosError
//       ) {
//         const axiosError = error as AxiosError;
//         const statusCode = axiosError.response?.status || 500;
//         const message =
//           (axiosError.response?.data as { message?: string })?.message ||
//           axiosError.message ||
//           "Kesalahan pada permintaan eksternal";
//         const details = axiosError.response?.data || null;
//         return errorResponse(res, message, details, statusCode);
//       }
//       return errorResponse(res, "Terjadi kesalahan", null, 500);
//     } else if (error instanceof Error) {
//       const parsedErrors = { message: error.message };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     } else {
//       const parsedErrors = { message: "Kesalahan tidak diketahui" };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     }
//   }
// };

// export const createGlobalRole = async (
//   req: AuthenticatedRequest,
//   res: Response
// ) => {
//   try {
//     const { kode, role, description } = req.body;

//     if (!kode || !role || !description) {
//       return errorResponse(res, "Missing required parameters", null, 400);
//     }

//     const globalRole = await GlobalRole.create({
//       kode: kode,
//       role: role,
//       description: description,
//     });
//     return successResponse(res, "Success create global role", globalRole);
//   } catch (error: unknown) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof UniqueConstraintError
//     ) {
//       const parsedErrors = error.errors.map((err) => ({
//         field: err.path,
//         message: err.message,
//       }));
//       return errorResponse(res, "Validation gagal", parsedErrors, 422);
//     } else if (
//       error instanceof DatabaseError ||
//       error instanceof ConnectionError
//     ) {
//       const parsedErrors = error.message;
//       return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
//     } else if (error instanceof ConnectionError) {
//       const parsedErrors = { message: "Gagal terhubung ke database" };
//       return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
//     } else if (error instanceof AxiosError) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "isAxiosError" in error &&
//         (error as AxiosError).isAxiosError
//       ) {
//         const axiosError = error as AxiosError;
//         const statusCode = axiosError.response?.status || 500;
//         const message =
//           (axiosError.response?.data as { message?: string })?.message ||
//           axiosError.message ||
//           "Kesalahan pada permintaan eksternal";
//         const details = axiosError.response?.data || null;
//         return errorResponse(res, message, details, statusCode);
//       }
//       return errorResponse(res, "Terjadi kesalahan", null, 500);
//     } else if (error instanceof Error) {
//       const parsedErrors = { message: error.message };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     } else {
//       const parsedErrors = { message: "Kesalahan tidak diketahui" };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     }
//   }
// };

// export const updateGlobalRole = async (
//   req: AuthenticatedRequest,
//   res: Response
// ) => {
//   try {
//     const id = req.params.id;
//     const { role, description } = req.body;
//     if (!id) {
//       return errorResponse(res, "Missing required parameters", null, 400);
//     }
//     const globalRole = await GlobalRole.findByPk(id);
//     if (!globalRole) {
//       return errorResponse(res, "Global role not found", null, 404);
//     }
//     if (role) globalRole.role = role;
//     if (description) globalRole.description = description;
//     await globalRole.save();
//     return successResponse(res, "Success update global role", globalRole);
//   } catch (error: unknown) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof UniqueConstraintError
//     ) {
//       const parsedErrors = error.errors.map((err) => ({
//         field: err.path,
//         message: err.message,
//       }));
//       return errorResponse(res, "Validation gagal", parsedErrors, 422);
//     } else if (
//       error instanceof DatabaseError ||
//       error instanceof ConnectionError
//     ) {
//       const parsedErrors = error.message;
//       return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
//     } else if (error instanceof ConnectionError) {
//       const parsedErrors = { message: "Gagal terhubung ke database" };
//       return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
//     } else if (error instanceof AxiosError) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "isAxiosError" in error &&
//         (error as AxiosError).isAxiosError
//       ) {
//         const axiosError = error as AxiosError;
//         const statusCode = axiosError.response?.status || 500;
//         const message =
//           (axiosError.response?.data as { message?: string })?.message ||
//           axiosError.message ||
//           "Kesalahan pada permintaan eksternal";
//         const details = axiosError.response?.data || null;
//         return errorResponse(res, message, details, statusCode);
//       }
//       return errorResponse(res, "Terjadi kesalahan", null, 500);
//     } else if (error instanceof Error) {
//       const parsedErrors = { message: error.message };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     } else {
//       const parsedErrors = { message: "Kesalahan tidak diketahui" };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     }
//   }
// };

// export const deleteGlobalRole = async (
//   req: AuthenticatedRequest,
//   res: Response
// ) => {
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return errorResponse(res, "Missing required parameters", null, 400);
//     }
//     const globalRole = await GlobalRole.findByPk(id);
//     if (!globalRole) {
//       return errorResponse(res, "Global role not found", null, 404);
//     }
//     await globalRole.destroy();
//     return successResponse(res, "Success delete global role", { id });
//   } catch (error: unknown) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof UniqueConstraintError
//     ) {
//       const parsedErrors = error.errors.map((err) => ({
//         field: err.path,
//         message: err.message,
//       }));
//       return errorResponse(res, "Validation gagal", parsedErrors, 422);
//     } else if (
//       error instanceof DatabaseError ||
//       error instanceof ConnectionError
//     ) {
//       const parsedErrors = error.message;
//       return errorResponse(res, "Kesalahan pada database", parsedErrors, 500);
//     } else if (error instanceof ConnectionError) {
//       const parsedErrors = { message: "Gagal terhubung ke database" };
//       return errorResponse(res, "Koneksi ke database gagal", parsedErrors, 503);
//     } else if (error instanceof AxiosError) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "isAxiosError" in error &&
//         (error as AxiosError).isAxiosError
//       ) {
//         const axiosError = error as AxiosError;
//         const statusCode = axiosError.response?.status || 500;
//         const message =
//           (axiosError.response?.data as { message?: string })?.message ||
//           axiosError.message ||
//           "Kesalahan pada permintaan eksternal";
//         const details = axiosError.response?.data || null;
//         return errorResponse(res, message, details, statusCode);
//       }
//       return errorResponse(res, "Terjadi kesalahan", null, 500);
//     } else if (error instanceof Error) {
//       const parsedErrors = { message: error.message };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     } else {
//       const parsedErrors = { message: "Kesalahan tidak diketahui" };
//       return errorResponse(res, "Terjadi kesalahan", parsedErrors, 500);
//     }
//   }
// };
