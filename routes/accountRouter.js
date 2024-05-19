import { Router } from "express";

import accountController from "../controllers/accountController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = new Router();

router.post('/change-password', accountController.changePassword);
router.get('/activation/:link', accountController.activateAccount);
router.delete('/delete-account/:id', accountController.deleteAccount);

export default router;