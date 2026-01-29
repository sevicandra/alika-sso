import { Router } from "express";
import Client from "./Client";
import Grant from "./Grant";
import Service from "./Service";
import Role from "./Role";
import Scope from "./Scope";
import User from "./User";
import ScopeAction from "./ScopeAction";

const router = Router();
router.use("/client", Client);
router.use("/grant", Grant);
router.use("/service", Service);
router.use("/role", Role);
router.use("/scope", Scope);
router.use("/user", User);
router.use("/scopeAction", ScopeAction);
export default router;
