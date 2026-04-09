import { Router } from "express";
import Role from "./Role.route";
import User from "./User.route";

const router = Router({ mergeParams: true });

router.use("/User", User);
router.use("/Role", Role);

export default router;
