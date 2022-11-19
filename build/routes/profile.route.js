"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_controller_1 = __importDefault(require("../controllers/profile.controller"));
const verify_jwt_middleware_1 = require("../middleware/verify_jwt.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const multer_middleware_1 = require("../middleware/multer.middleware");
const roles_1 = require("../config/roles");
const router = express_1.default.Router();
router.get('/get_all', verify_jwt_middleware_1.verifyJWT, (0, authorize_middleware_1.authorized)(roles_1.roleList.admin), profile_controller_1.default.readAllProfiles);
router.patch('/update/:id', verify_jwt_middleware_1.verifyJWT, profile_controller_1.default.updateProfile);
router.delete('/delete/:id', verify_jwt_middleware_1.verifyJWT, profile_controller_1.default.deleteProfile);
router.get('/show/:id', verify_jwt_middleware_1.verifyJWT, profile_controller_1.default.readProfile);
router.post('/upload_profile', verify_jwt_middleware_1.verifyJWT, multer_middleware_1.uploadSingle, profile_controller_1.default.uploadFile);
exports.default = router;
