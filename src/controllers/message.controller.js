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
const message_model_1 = __importDefault(require("../models/message.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const readAllMessages = (req, res) => {
    return message_model_1.default.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).json({ err }));
};
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message_id = req.params.id;
    try {
        const message = yield message_model_1.default.findOneAndUpdate({ _id: message_id }, req.body, { new: true, rawResult: true });
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ message: message_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(message))
            return res.status(403).json({ message: 'Message private!!' });
        console.log(message.value);
        return res.status(200).json({ message: 'Message updated successfully' });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message_id = req.params.id;
    try {
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ message: message_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user))
            return res.status(403).json({ message: 'Message private!!' });
        const result = yield message_model_1.default.findByIdAndDelete(message_id);
        result ? res.status(201).json({ message: 'Message deleted!' }) : res.status(404).json({ message: 'Not found!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Something wrong!' });
    }
});
const readMessage = (req, res) => {
    const message_id = req.params.id;
    return message_model_1.default.findById(message_id)
        .select('-__v')
        .then(message => res.status(200).json({ message }))
        .catch(err => res.status(500).json({ err }));
};
exports.default = {
    readAllMessages,
    updateMessage,
    deleteMessage,
    readMessage,
};
