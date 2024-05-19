import accountService from "../services/accountService.js";

class AccountController {
    async activateAccount(req, res, next) {
        try {
            const activationLink = req.params.link;
            await accountService.activateAccount(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const id = req.params.id;
            const { token } = req.cookies;
            const user = await accountService.deleteAccount(id, token);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { email, password, newPassword } = req.body;
            const { token } = req.cookies;
            const userData = await accountService.changePassword(email, token, password, newPassword);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

export default new AccountController();