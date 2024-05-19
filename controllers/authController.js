import { validationResult } from "express-validator";

import authService from "../services/authService.js";
import ApiError from "../exceptions/ApiError.js";

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation Error", errors.array()));
            }

            const { email, password } = req.body;
            const userData = await authService.registration(email, password);

            res.cookie("token", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await authService.login(email, password);

            res.cookie("token", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { token } = req.cookies;
            const tok = await authService.logout(token);
            res.clearCookie("token");
            return res.json(tok);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { token } = req.cookies;
            const userData = await authService.refresh(token);

            res.cookie("token", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController();