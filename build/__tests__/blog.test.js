"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { MongoClient } = require('mongodb');
const config_1 = require("../config/config");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../utils/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, server_1.default)();
describe('Blog Module', () => {
    const client = new MongoClient(config_1.config.mongo.testUrl);
    const start = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('db test connected');
        }
        catch (err) {
            console.log(err);
        }
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        start();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        client.close();
    }));
    describe('Operate on one post ts_blog_001', () => {
        const post_payload = {
            title: 'test title',
            description: 'loremIpsum djawjd kwaj dkajw dkjawk jd',
            author: new mongoose_1.default.Types.ObjectId()
        };
        const user_payload = {
            username: 'aleks',
            role: {
                user: 'user'
            }
        };
        const refresh_token = jsonwebtoken_1.default.sign({
            username: user_payload.username,
            role: user_payload.role
        }, config_1.config.token.refresh, {
            expiresIn: '1d'
        });
        describe('Given the user is logged in tc_post_001', () => {
            it('should return status 200 and return a post', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body, statusCode } = yield (0, supertest_1.default)(app).post('/api/posts/new_post').set('Authorization', `Bearer ${refresh_token}`).send(post_payload);
                expect(statusCode).toBe(200);
            }));
        });
    });
});
