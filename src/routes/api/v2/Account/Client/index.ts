import { Router } from "express";
import {
  getAllClient,
  getClientById,
  deleteClient,
  createClient,
} from "@/controllers/v2/account/client/client.controller";
import Grant from "./Grant";
import Redirect from "./Redirect";
import Scope from "./Scope";

const router = Router({ mergeParams: true });

router.get("/", getAllClient);
router.get("/:ClientId", getClientById);
router.post("/", createClient);
router.delete("/:ClientId", deleteClient);

router.use("/:ClientId/Grant", Grant);
router.use("/:ClientId/Redirect", Redirect);
router.use("/:ClientId/Scope", Scope);


export default router;
