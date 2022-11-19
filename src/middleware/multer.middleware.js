"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const uploadFiles_1 = require("../config/uploadFiles");
exports.uploadSingle = (0, multer_1.default)({ storage: uploadFiles_1.storage, fileFilter: uploadFiles_1.fileFilter }).single('avatar');
