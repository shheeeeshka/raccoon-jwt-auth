import { Router } from "express";

import authRouter from "./authRouter.js";
import accountRouter from "./accountRouter.js";

const router = new Router();

router.use('/auth', authRouter);
router.use('/account', accountRouter);

export default router;