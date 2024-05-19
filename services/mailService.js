import nodemailer from "nodemailer";

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `[${process.env.CLIENT_URL}] Account verification`,
            text: "",
            html: `
            <h1>To activate your profile press button below</h1>
            <button><a href='${link}'>Confirm Email</a></button><br>
            `
        });
    }
}

export default new MailService();