import { Router } from "express";
import User from "./User.route";
import Service from "./Service";
import ScopeAction from "./ScopeAction.route";
import Referensi from "./Referensi";
import Client from "./Client";
const router = Router({ mergeParams: true });

router.use("/User", User);
router.use("/Service", Service);
router.use("/ScopeAction", ScopeAction);
router.use("/Referensi", Referensi);
router.use("/Client", Client);


export default router;
