"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongo_username = process.env.MONGODB_USERNAME || '';
const mongo_password = process.env.MONGODB_PASSWORD || '';
const server_port = Number(process.env.SERVER_PORT) || 5500;
const access_token_secret = process.env.ACCESS_TOKEN_SECRET || 'udhwaudhuq2hawdu23hud23';
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET || 'udhwaudhuq2hawdu23hud23';
const mongo_url = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.zas4qfm.mongodb.net/`;
const mongo_test_url = `mongodb://localhost:27017/test2`;
exports.config = {
    mongo: {
        url: mongo_url,
        testUrl: mongo_test_url
    },
    server: {
        port: server_port
    },
    token: {
        access: access_token_secret,
        refresh: refresh_token_secret
    }
};
