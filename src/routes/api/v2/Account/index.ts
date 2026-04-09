import { Router } from "express";
import Client from "./Client.route";
import Grant from "./Grant.route";
import Referensi from "./Referensi.route";
import ScopeAction from "./ScopeAction.route";
import Service from "./Service.route";
import User from "./User.route";

const router = Router({ mergeParams: true });

router.use("/User", User);
router.use("/Service", Service);
router.use("/ScopeAction", ScopeAction);
router.use("/Client", Client);
router.use("/Grant", Grant);
router.use("/Referensi", Referensi);

export default router;
