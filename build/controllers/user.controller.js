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
const user_model_1 = __importDefault(require("../models/user.model"));
const profile_model_1 = __importDefault(require("../models/profile.model"));
const user_service_1 = __importDefault(require("../services/user.service"));
const readUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const found_user = yield user_service_1.default.find_user({ _id: userId });
        if (!found_user)
            return res.status(404).json({ message: 'user not found!' });
        res.status(200).json(found_user);
    }
    catch (err) {
        res.status(500).json({ message: 'something wrong' });
    }
});
const readAllUsers = (req, res, next) => {
    return user_model_1.default.find()
        .populate({ path: 'profile', select: ['gender', 'birthday'] })
        .then((users) => res.status(200)
        .json(users))
        .catch((err) => {
        return res.status(500).json(err);
    });
};
const updateUser = (req, res, next) => {
};
const deleteUser = (req, res, next) => {
};
const CreateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { birthday, gender } = req.body;
    const userExists = yield user_model_1.default.findById(userId);
    if (userExists) {
        const profile = new profile_model_1.default({
            birthday,
            gender
        });
    }
});
exports.default = {
    readUser,
    readAllUsers,
    updateUser,
    deleteUser,
    CreateUserProfile
};
