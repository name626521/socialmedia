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
const notification_model_1 = __importDefault(require("../models/notification.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const readAllNotifications = (req, res) => {
    return notification_model_1.default.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(notifications => res.status(200).json(notifications))
        .catch(err => res.status(500).json({ err }));
};
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notification_id = req.params.id;
    try {
        const notification = yield notification_model_1.default.findOneAndUpdate({ _id: notification_id }, req.body, { new: true, rawResult: true });
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ notification: notification_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(notification))
            return res.status(403).json({ message: 'Notification private!!' });
        console.log(notification.value);
        return res.status(200).json({ message: 'Notification updated successfully' });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notification_id = req.params.id;
    try {
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ notification: notification_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user))
            return res.status(403).json({ message: 'Notification private!!' });
        const result = yield notification_model_1.default.findByIdAndDelete(notification_id);
        result ? res.status(201).json({ message: 'Notification deleted!' }) : res.status(404).json({ message: 'Not found!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Something wrong!' });
    }
});
const readNotification = (req, res) => {
    const notification_id = req.params.id;
    return notification_model_1.default.findById(notification_id)
        .select('-__v')
        .then(notification => res.status(200).json({ notification }))
        .catch(err => res.status(500).json({ err }));
};
exports.default = {
    readAllNotifications,
    updateNotification,
    deleteNotification,
    readNotification,
};
