const mongoose = require("mongoose");

async function connectMongoDB({ url, options = {} }) {
    try {
        await mongoose.connect(url, {
            ...options,
        });
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}

module.exports = connectMongoDB;
