import jwt from "jsonwebtoken";

import { Token } from "../models/models.js";

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
            expiresIn: "60m"
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: "30d"
        });

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refrToken) {
        const tokenData = await Token.findOne({ where: { userId } });
        if (tokenData) {
            tokenData.token = refrToken;
            return tokenData.save();
        }

        const tokenn = await Token.create({ token: refrToken, userId });
        return tokenn;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async removeToken(token) {
        const tokenData = await Token.destroy({ where: { token } });
        return tokenData;
    }

    async findToken(token) {
        const tokenData = await Token.findOne({ where: { token } });
        return tokenData;
    }
}

export default new TokenService();