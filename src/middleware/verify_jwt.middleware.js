"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const verifyJWT = (req, res, next) => {
    const auth_header = req.headers.authorization || req.headers.Authorization;
    if (!auth_header)
        return res.status(401).json({ message: 'Not allowed!' });
    const token = auth_header.split(' ')[1];
    if (auth_header.split(' ')[0] !== 'Bearer')
        return res.status(401).json({ message: 'Invalid format!' });
    //@ts-ignore
    jsonwebtoken_1.default.verify(token, config_1.config.token.refresh, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Forbidden!' });
        //@ts-ignore
        req.user = decoded.username;
        //@ts-ignore
        req.roles = decoded.roles;
        next();
    });
};
exports.verifyJWT = verifyJWT;
