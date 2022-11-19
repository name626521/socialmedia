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
const post_model_1 = __importDefault(require("../models/post.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const post_service_1 = __importDefault(require("../services/post.service"));
const readAllPosts = (req, res) => {
    return post_model_1.default.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({ err }));
};
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post_id = req.params.id;
    try {
        const post = yield post_model_1.default.findOneAndUpdate({ _id: post_id }, req.body, { new: true, rawResult: true });
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ post: post_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(post))
            return res.status(403).json({ message: 'Post private!!' });
        console.log(post.value);
        return res.status(200).json({ message: 'Post updated successfully' });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post_id = req.params.id;
    try {
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ post: post_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user))
            return res.status(403).json({ message: 'Post private!!' });
        const result = yield post_model_1.default.findByIdAndDelete(post_id);
        result ? res.status(201).json({ message: 'Post deleted!' }) : res.status(404).json({ message: 'Not found!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Something wrong!' });
    }
});
const readPost = (req, res) => {
    const post_id = req.params.id;
    return post_model_1.default.findById(post_id)
        .select('-__v')
        .then(post => res.status(200).json({ post }))
        .catch(err => res.status(500).json({ err }));
};
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, author } = req.body;
    try {
        const post = yield post_service_1.default.create_post({ title, description, author });
        return res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json({ err });
    }
});
exports.default = {
    readAllPosts,
    updatePost,
    deletePost,
    readPost,
    createPost
};
