import ApiError from "../exceptions/ApiError.js";
import tokenService from "../services/tokenService.js";

export default function (req, res, next) {
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
        if (!userData) {
            return next(ApiError.Unauthorized());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.Unauthorized());
    }
}