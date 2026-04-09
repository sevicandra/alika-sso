import { Router } from "express";
import { authorizeRoles } from "@/middlewares/authenticate.middleware";
import Account from "./Account";
import Mutasi from "./Mutasi";

const router = Router({ mergeParams: true });

router.use("/Mutasi", authorizeRoles(["mutasi.admin"]), Mutasi);
router.use("/Account", authorizeRoles(["account.admin"]), Account);

export default router;
