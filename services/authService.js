import * as uuid from "uuid";
import bcrypt from "bcrypt";

import { User } from "../models/models.js";
import ApiError from "../exceptions/ApiError.js";
import mailService from "./mailService.js";
import UserDto from "../dtos/userDto.js";
import tokenService from "./tokenService.js";

class AuthService {
    async registration(email, password) {
        const candidate = await User.findOne({ where: { email } });

        if (candidate) {
            throw ApiError.BadRequest(`User ${email} already exists`);
        }

        const activationLink = uuid.v4();
        const hashPassword = await bcrypt.hash(password, 5);

        const user = await User.create({
            email,
            password: hashPassword,
            activationLink,
        });

        // await mailService.sendActivationMail(email, `${process.env.API_URL}/user/activation/${activationLink}`); add smtp data to send activation mail

        const userDto = new UserDto({ ...user.dataValues });
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequest(`User ${email} not found`)
        }

        const isPassEq = await bcrypt.compare(password, user.password);
        if (!isPassEq) {
            throw ApiError.BadRequest(`Incorrect password`)
        }

        const userDto = new UserDto({ ...user.dataValues });
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const userTokenFromDB = await tokenService.findToken(refreshToken);

        if (!userData || !userTokenFromDB) {
            throw ApiError.Unauthorized();
        }

        const user = await User.findOne({ where: { id: userData.id } });
        const userDto = new UserDto({ ...user.dataValues });
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }
}

export default new AuthService();