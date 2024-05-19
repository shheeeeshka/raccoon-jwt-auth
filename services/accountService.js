import ApiError from "../exceptions/ApiError.js";
import { User } from "../models/models.js";
import tokenService from "./tokenService.js";

class AccountService {
    async activateAccount(activationLink) {
        const user = await User.findOne({ where: { activationLink } });

        if (!user) {
            throw ApiError.BadRequest(`Incorrect activation link`);
        }

        user.isActivated = true;
        return user.save();
    }

    async deleteAccount(id, token) {
        if (!token) {
            throw ApiError.Unauthorized();
        }

        const decodedToken = tokenService.validateRefreshToken(token);

        if (id != decodedToken.id) {
            throw ApiError.Forbidden(`We're sorry, but you don't have permission to delete account ${id}`);
        }

        await tokenService.removeToken(token);
        const user = await User.destroy({ where: { id } });
        return user;
    }

    async changePassword(email, token, pass, newPass) {
        if (!email || !token) {
            throw ApiError.Unauthorized();
        }

        const decodedToken = tokenService.validateRefreshToken(token);
        if (decodedToken.email !== email) {
            throw ApiError.Forbidden(`We're sorry, but you don't have permission to change password for ${email}`);
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequest();
        }

        const isPassCorrect = await bcrypt.compare(pass, user.password);
        if (!isPassCorrect) {
            throw ApiError.BadRequest(`Incorrect password`);
        }

        const isPassEq = pass === newPass;
        if (isPassEq) {
            throw ApiError.BadRequest(`Your new password bust be different from the old one`);
        }

        const newHashPass = await bcrypt.hash(newPass, 5);
        user.password = newHashPass;

        return user.save();
    }
}

export default new AccountService();