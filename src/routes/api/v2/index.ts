import { Router } from "express";
import Mutasi from "./Mutasi";
import Account from "./Account";

const router = Router({ mergeParams: true });
import { authorizeRoles } from "@/middlewares/authenticate.middleware";

router.use("/Mutasi", authorizeRoles(["mutasi.admin"]), Mutasi);
router.use("/Account", authorizeRoles(["account.admin"]), Account);

export default router;
