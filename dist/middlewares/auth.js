"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const utilis_1 = require("../utilis/utilis");
const jwtsecret = process.env.JWT_SECRET;
async function auth(req, res, next) {
    try {
        //const authorization = req.headers.authorization;
        // authorization using cookies
        const authorization = req.cookies.token;
        if (!authorization) {
            return res.status(401).json({ Error: "Kindly sign in as a user" });
        }
        //const token = authorization.slice(7, authorization.length)
        let verified = jsonwebtoken_1.default.verify(authorization, jwtsecret); // for cookies
        //let verified = jwt.verify(token, jwtsecret)
        if (!verified) {
            return res.status(401).json({ Error: "Token is Invalid; you can't access this route" });
        }
        const { userId } = verified;
        // find user by id
        const user = await userModel_1.default.findOne({ where: { _id: userId } });
        if (!utilis_1.registerUserSchema) {
            return res.status(401).json({ Error: "Kindly sign in as a user" });
        }
        req.user = verified;
        res.locals.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ Error: "User not looged in" });
    }
}
exports.auth = auth;
