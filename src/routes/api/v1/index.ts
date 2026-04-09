import { Router } from "express";
import Client from "./Client";
import Grant from "./Grant";
import Role from "./Role";
import Scope from "./Scope";
import ScopeAction from "./ScopeAction";
import Service from "./Service";
import User from "./User";

const router = Router();
router.use("/client", Client);
router.use("/grant", Grant);
router.use("/service", Service);
router.use("/role", Role);
router.use("/scope", Scope);
router.use("/user", User);
router.use("/scopeAction", ScopeAction);
export default router;
