import { Router } from "express";
import { body } from "express-validator";

import authController from "../controllers/authController.js";

const router = new Router();

router.post('/registration',
    body("email")
        .isEmail()
        .withMessage("Invalid email"),
    body("password")
        .isLength({ min: 8, max: 50 })
        .withMessage("Your password must be between 8 and 50 symbols"), authController.registration);
router.post('/login', body("email").isEmail(), authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

export default router;