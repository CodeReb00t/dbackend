
const express = require("express");
const cors = require("cors");

// Map of common middleware keywords
const builtIn = {
    json: express.json(),
    urlencoded: express.urlencoded({ extended: true }),
    cors: cors(),
};

function middlewares(app, options = []) {
    if (!app || typeof app.use !== "function") {
        throw new Error("A valid Express app instance is required");
    }

    options.forEach((middleware) => {
        if (typeof middleware === "string" && builtIn[middleware]) {
            app.use(builtIn[middleware]);
        } else if (typeof middleware === "function") {
            app.use(middleware);
        } else {
            console.warn(`⚠️ Unknown middleware:`, middleware);
        }
    });
}

module.exports = middlewares;
