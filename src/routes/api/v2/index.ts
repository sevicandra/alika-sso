import { Router } from "express";
import Mutasi from "./Mutasi";
import Account from "./Account";

const router = Router({ mergeParams: true });
import { authenticate } from "@/middlewares/auth.middleware";

router.use("/Mutasi", authenticate([], ["mutasi.admin"]), Mutasi);
router.use("/Account", authenticate([], ["account.admin"]), Account);

export default router;
