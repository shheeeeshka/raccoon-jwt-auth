import ApiError from "../exceptions/ApiError.js";
import tokenService from "../services/tokenService.js";

export default function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return next(ApiError.Unauthorized());
            }

            const accessToken = authHeader.split(" ")[1];
            if (!accessToken) {
                return next(ApiError.Unauthorized());
            }

            const userData = tokenService.validateAccessToken(accessToken);
            if (!userData.role.includes(role)) {
                return next(ApiError.Forbidden("Access denied :("));
            }

            req.user = userData;
            next();
        } catch (e) {
            next(ApiError.Unauthorized());
        }
    }
}