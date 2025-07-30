import { Router } from "express";
import User from "./User.route";
import Role from "./Role.route";

const router = Router({ mergeParams: true });

router.use("/User", User);
router.use("/Role", Role);

export default router;
