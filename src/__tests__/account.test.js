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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../utils/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const { MongoClient } = require('mongodb');
const config_1 = require("../config/config");
const user_service_1 = __importDefault(require("../services/user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, server_1.default)();
describe('Account Module', () => {
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
    describe('login ts_account_001', () => {
        describe('tc_login_001', () => {
            it('Should return 404, route not found', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app).post('/api/auth/logins');
                expect(res.statusCode).toBe(404);
            }));
        });
        describe('tc_login_002', () => {
            it('Given an empty email or password should return 400', () => __awaiter(void 0, void 0, void 0, function* () {
                const user_payload_1 = { email: '', password: '12345678' };
                const user_payload_2 = { email: 'exist@test.com', password: '' };
                const res1 = yield (0, supertest_1.default)(app).post('/api/auth/login').send(user_payload_1);
                const res2 = yield (0, supertest_1.default)(app).post('/api/auth/login').send(user_payload_2);
                expect(res1.statusCode).toBe(400);
                expect(res2.statusCode).toBe(400);
            }));
        });
        describe('tc_login_003', () => {
            it('Given a valid email and password should return status 200 and access token', () => __awaiter(void 0, void 0, void 0, function* () {
                //We want a valid user to authenticate
                const user_payload = { username: 'John', email: 'newuser@site.com', password: 'password', profile: new mongoose_1.default.Types.ObjectId() };
                //@ts-ignore
                const findUserServiceMock = jest.spyOn(user_service_1.default, 'find_user').mockReturnValue({ email: user_payload.email });
                const bcryptCompare = jest.fn().mockReturnValue(true);
                bcrypt_1.default.compare = bcryptCompare;
                //@ts-ignore
                const saveUserServiceMock = jest.spyOn(user_service_1.default, 'save_user').mockReturnValue(user_payload);
                const { body, statusCode, headers } = yield (0, supertest_1.default)(app).post('/api/auth/login').send({ email: user_payload.email, password: user_payload.password });
                expect(bcryptCompare).toHaveBeenCalled();
                expect(findUserServiceMock).toHaveBeenCalledWith({ email: user_payload.email });
                expect(saveUserServiceMock).toHaveBeenCalledTimes(1);
                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    access_token: expect.any(String)
                });
                expect(headers['set-cookie']).toBeTruthy();
            }));
        });
    });
    describe('Operate on one user ts_account_003', () => {
        describe('Show 1 user route does not exist', () => {
            it('Should return 404', () => __awaiter(void 0, void 0, void 0, function* () {
                const user_id = new mongoose_1.default.Types.ObjectId;
                const response = yield (0, supertest_1.default)(app).get(`/api/users/show/${user_id}`);
                expect(response.statusCode).toEqual(404);
            }));
        });
        describe('Show one user route exist', () => {
            //create the user
            //test if this created user route exist
            it('should return 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app).get('/api/users/show');
            }));
        });
    });
});
