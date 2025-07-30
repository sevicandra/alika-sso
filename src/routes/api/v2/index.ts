import { Router } from "express";
import Mutasi from "./Mutasi";

const router = Router({ mergeParams: true });

router.use("/Mutasi", Mutasi);

export default router;
