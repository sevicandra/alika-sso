import { Router } from "express";
import User from "./User.route";
import Service from "./Service.route";
import ScopeAction from "./ScopeAction.route";
import Client from "./Client.route";
import Grant from "./Grant.route";
const router = Router({ mergeParams: true });

router.use("/User", User);
router.use("/Service", Service);
router.use("/ScopeAction", ScopeAction);
router.use("/Client", Client);
router.use("/Grant", Grant);

export default router;
