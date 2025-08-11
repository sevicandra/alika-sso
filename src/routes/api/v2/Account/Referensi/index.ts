import { Router } from "express";
import Role from "./Role.route";
import Service from "./Service.route";
import ScopeAction from "./ScopeAction.route";
import Grant from "./Grant.route";

const router = Router({ mergeParams: true });
router.use("/Role", Role);
router.use("/Service", Service);
router.use("/ScopeAction", ScopeAction);
router.use("/Grant", Grant);

export default router;
