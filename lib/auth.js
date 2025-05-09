const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function createAuth({ jwtSecret, db, userCollectionName = "users", mailer, jwtExpiry = "1h" }) {
    const users = db.collection(userCollectionName);

    return {
        // SIGNUP
        async signup({ email, password, name }) {
            if (!email || !password || !name) throw new Error("All fields are required");

            const existing = await users.findOne({ email });
            if (existing) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = jwt.sign({ email }, jwtSecret, { expiresIn: "1d" });

            await users.insertOne({
                email,
                password: hashedPassword,
                name,
                verified: false,
                createdAt: new Date()
            });

            if (mailer) {
                await mailer.sendMail({
                    to: email,
                    subject: "Verify your email",
                    html: `<a href="http://localhost:3000/verify?token=${verificationToken}">Click here to verify your email</a>`
                });
            }

            return { success: true, message: "Signup successful. Please verify your email." };
        },

        // EMAIL VERIFICATION
        async verifyEmail(token) {
            try {
                const { email } = jwt.verify(token, jwtSecret);
                const res = await users.updateOne({ email }, { $set: { verified: true } });

                if (res.modifiedCount === 0) throw new Error("User not found or already verified");
                return { success: true, message: "Email verified successfully." };
            } catch (err) {
                throw new Error("Invalid or expired verification token");
            }
        },

        // SIGNIN
        async signin({ email, password }) {
            if (!email || !password) throw new Error("Email and password required");

            const user = await users.findOne({ email });
            if (!user) throw new Error("User not found");
            if (!user.verified) throw new Error("Please verify your email before signing in");

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error("Invalid password");

            const payload = { id: user._id, email: user.email };
            const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });

            // optional: update last login
            await users.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

            return {
                success: true,
                message: "Sign in successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        },

        // SIGNOUT (placeholder — blacklist logic optional)
        async signout(token) {
            // You can add this token to a Redis or DB-based blacklist
            return { success: true, message: "Signed out successfully" };
        },
        async forgotPassword(email) {
            const user = await users.findOne({ email });
            if (!user) throw new Error("User not found");

            const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });

            if (mailer) {
                await mailer.sendMail({
                    to: email,
                    subject: "Password Reset Request",
                    html: `<p>Click below to reset your password:</p>
                           <a href="http://localhost:3000/reset-password?token=${token}">
                           Reset Password</a>`
                });
            }

            return { success: true, message: "Password reset link sent to your email." };
        },

        // RESET PASSWORD
        async resetPassword(token, newPassword) {
            try {
                const { email } = jwt.verify(token, jwtSecret);
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const result = await users.updateOne(
                    { email },
                    { $set: { password: hashedPassword } }
                );

                if (result.modifiedCount === 0) throw new Error("User not found or password already up to date");

                return { success: true, message: "Password has been reset successfully." };
            } catch (err) {
                throw new Error("Invalid or expired token");
            }
        },
        // MIDDLEWARE (protect routes)
        middleware() {
            return (req, res, next) => {
                const authHeader = req.headers.authorization;
                if (!authHeader) return res.status(401).json({ error: "Token missing" });

                const token = authHeader.split(" ")[1];
                try {
                    const user = jwt.verify(token, jwtSecret);
                    req.user = user;
                    next();
                } catch (err) {
                    return res.status(401).json({ error: "Invalid or expired token" });
                }
            };
        }
    };
}

module.exports = createAuth;
