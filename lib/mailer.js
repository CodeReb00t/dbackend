const nodemailer = require("nodemailer");

function createMailer(config) {
    const transporter = nodemailer.createTransport(config);

    async function sendMail({ to, subject, text, html }) {
        const mailOptions = {
            from: config.auth.user,
            to,
            subject,
            text,
            html,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("✅ Email sent:", info.response);
            return info;
        } catch (error) {
            console.error("❌ Email send failed:", error);
            throw error;
        }
    }

    return {
        sendMail,
    };
}

module.exports = createMailer;
