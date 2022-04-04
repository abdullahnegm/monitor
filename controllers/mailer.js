const nodemailer = require("nodemailer");
require('dotenv').config()

module.exports = async function sendMail(mailProps) {
    user = process.env.G_email
    let { to, cc, subject, attachments, text, html } = mailProps;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:process.env.G_email,
            pass: process.env.G_pass,
        },
        logger: true,
        debuger: true
    });

    await transporter.sendMail({
        from: user, to, ...(cc ? { cc } : {}), subject,
        ...(text ? { text } : {}), // plain text body
        ...(attachments ? { attachments } : {}),
        ...(html ? { html } : {})
    });

    return {
        result: "send successfully",
        error: undefined
    };
}