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
const profile_model_1 = __importDefault(require("../models/profile.model"));
const media_model_1 = __importDefault(require("../models/media.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const readAllProfiles = (req, res) => {
    return profile_model_1.default.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(profiles => res.status(200).json(profiles))
        .catch(err => res.status(500).json({ err }));
};
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profile_id = req.params.id;
    try {
        const profile = yield profile_model_1.default.findOneAndUpdate({ _id: profile_id }, req.body, { new: true, rawResult: true });
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ profile: profile_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(profile))
            return res.status(403).json({ message: 'Profile private!!' });
        console.log(profile.value);
        return res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profile_id = req.params.id;
    try {
        const refresh_token = req.cookies.jwt;
        const found_user = yield user_model_1.default.findOne({ refreshToken: refresh_token });
        const user_owner = yield user_model_1.default.findOne({ profile: profile_id });
        console.log('req user ', found_user);
        console.log('owner ', user_owner);
        if (!found_user)
            return res.status(403).json({ message: 'User not found' });
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user))
            return res.status(403).json({ message: 'Profile private!!' });
        const result = yield profile_model_1.default.findByIdAndDelete(profile_id);
        result ? res.status(201).json({ message: 'Profile deleted!' }) : res.status(404).json({ message: 'Not found!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Something wrong!' });
    }
});
const readProfile = (req, res) => {
    const profile_id = req.params.id;
    return profile_model_1.default.findById(profile_id)
        .select('-__v')
        .then(profile => res.status(200).json({ profile }))
        .catch(err => res.status(500).json({ err }));
};
const uploadFile = (req, res) => {
    var _a;
    //@ts-ignore
    console.log(req.name);
    media_model_1.default.create({
        name: req.body.name,
        img: {
            //@ts-ignore
            data: fs.readFileSync(path.resolve('./src/photos/' + req.name)),
            ContentType: (_a = req.file) === null || _a === void 0 ? void 0 : _a.mimetype
        }
    }).then(image => console.log(image)).catch(err => console.log(err));
    return res.status(200).json({ message: 'Uploaded file successfully' });
};
exports.default = {
    readAllProfiles,
    updateProfile,
    deleteProfile,
    readProfile,
    uploadFile
};
