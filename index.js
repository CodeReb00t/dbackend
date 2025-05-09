const connectMongoDB = require("./lib/mongodb");
const createMailer = require("./lib/mailer");
const middlewares = require("./lib/middlewares");
const createAuth = require("./lib/auth")
const backend = {
    mongodb: connectMongoDB,
    mailer: createMailer,
    middlewares: middlewares,
    auth: createAuth,
};

module.exports = backend;
