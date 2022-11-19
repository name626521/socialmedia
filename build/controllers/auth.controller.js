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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const user_model_1 = __importDefault(require("../models/user.model"));
const profile_model_1 = __importDefault(require("../models/profile.model"));
const user_service_1 = __importDefault(require("../services/user.service"));
const handleNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: 'Invalid username or password!' });
    const userExists = yield user_model_1.default.findOne({ email }).exec();
    if (userExists)
        return res.status(409).json({ message: 'Email already used!' });
    try {
        //Encrypt password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const profile = yield profile_model_1.default.create({});
        user_service_1.default.create_user({
            username,
            email,
            password: hashedPassword,
            profile: profile._id
        });
        res.status(201).json({ success: 'New user created succesfully!' });
    }
    catch (err) {
        res.status(500).json({ err });
    }
});
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ err: 'Invalid email or password!' });
    const found_user = yield user_service_1.default.find_user({ email });
    if (!found_user)
        return res.status(401).json({ err: 'User not found!' });
    //Evaluate password
    const match = yield bcrypt_1.default.compare(password, found_user.password);
    if (match) {
        //create jwt token
        const access_token = jsonwebtoken_1.default.sign({
            'username': found_user.username,
            'roles': found_user.role
        }, config_1.config.token.access, { expiresIn: '60s' });
        const refresh_token = jsonwebtoken_1.default.sign({ 'username': found_user.username, 'roles': found_user.role }, config_1.config.token.refresh, { expiresIn: '1d' });
        //Save refresh token
        found_user.refreshToken = refresh_token;
        yield user_service_1.default.save_user(found_user);
        res.cookie('jwt', refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            // secure: true,
            maxAge: 60 * 60 * 24 * 1000
        });
        res.json({ access_token });
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.status(401).json({ message: 'Unauthorized!' });
    const refresh_token = cookies.jwt;
    const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
    if (!found_user)
        return res.status(403).json({ message: 'Forbidden!' });
    //@ts-ignore
    jsonwebtoken_1.default.verify(refresh_token, config_1.config.token.refresh, (err, decoded) => {
        if (err || found_user.username !== decoded.username)
            return res.status(403).json({ message: 'Forbidden!' });
        const access_token = jsonwebtoken_1.default.sign({
            "username": decoded.username,
            "roles": decoded.roles
        }, config_1.config.token.access, {
            expiresIn: '3600s'
        });
        res.json(access_token).status(200);
    });
});
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    if (!(cookie === null || cookie === void 0 ? void 0 : cookie.jwt)) {
        return res.status(204).json({ message: 'DGUugduwdugawd' });
    }
    const refresh_token = cookie.jwt;
    const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
    if (!found_user) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' });
        return res.status(403).json({ message: 'Forbidden' });
    }
    yield user_model_1.default.updateOne({ refreshToken: refresh_token }, { $set: { refreshToken: '' } });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' });
    return res.status(200).json({ message: 'Logged Out!' });
});
exports.default = {
    handleNewUser,
    handleLogin,
    handleRefreshToken,
    handleLogout
};
