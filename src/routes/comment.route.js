"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = __importDefault(require("../controllers/comment.controller"));
const verify_jwt_middleware_1 = require("../middleware/verify_jwt.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const roles_1 = require("../config/roles");
const router = express_1.default.Router();
router.get('/get_all', verify_jwt_middleware_1.verifyJWT, (0, authorize_middleware_1.authorized)(roles_1.roleList.admin), comment_controller_1.default.readAllComments);
router.patch('/update/:id', verify_jwt_middleware_1.verifyJWT, comment_controller_1.default.updateComment);
router.delete('/delete/:id', verify_jwt_middleware_1.verifyJWT, comment_controller_1.default.deleteComment);
router.get('/show/:id', verify_jwt_middleware_1.verifyJWT, comment_controller_1.default.readComment);
exports.default = router;
