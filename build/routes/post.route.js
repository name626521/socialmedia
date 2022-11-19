"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const verify_jwt_middleware_1 = require("../middleware/verify_jwt.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const roles_1 = require("../config/roles");
const router = express_1.default.Router();
router.get('/get_all', verify_jwt_middleware_1.verifyJWT, post_controller_1.default.readAllPosts);
router.patch('/update/:id', verify_jwt_middleware_1.verifyJWT, (0, authorize_middleware_1.authorized)(roles_1.roleList.editor), post_controller_1.default.updatePost);
router.delete('/delete/:id', verify_jwt_middleware_1.verifyJWT, post_controller_1.default.deletePost);
router.get('/show/:id', verify_jwt_middleware_1.verifyJWT, post_controller_1.default.readPost);
router.post('/new_post', verify_jwt_middleware_1.verifyJWT, post_controller_1.default.createPost);
exports.default = router;
