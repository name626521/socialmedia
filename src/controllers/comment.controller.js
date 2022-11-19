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
const comment_model_1 = __importDefault(require("../models/comment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const readAllComments = (req, res) => {
    return comment_model_1.default.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(comments => res.status(200).json(comments))
        .catch(err => res.status(500).json({ err }));
};
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment_id = req.params.id;
    try {
        const comment = yield comment_model_1.default.findOneAndUpdate({ _id: comment_id }, req.body, { new: true, rawResult: true });
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ comment: comment_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(comment))
            return res.status(403).json({ message: 'Comment private!!' });
        console.log(comment.value);
        return res.status(200).json({ message: 'Comment updated successfully' });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment_id = req.params.id;
    try {
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ comment: comment_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user))
            return res.status(403).json({ message: 'Comment private!!' });
        const result = yield comment_model_1.default.findByIdAndDelete(comment_id);
        result ? res.status(201).json({ message: 'Comment deleted!' }) : res.status(404).json({ message: 'Not found!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Something wrong!' });
    }
});
const readComment = (req, res) => {
    const comment_id = req.params.id;
    return comment_model_1.default.findById(comment_id)
        .select('-__v')
        .then(comment => res.status(200).json({ comment }))
        .catch(err => res.status(500).json({ err }));
};
exports.default = {
    readAllComments,
    updateComment,
    deleteComment,
    readComment
};
