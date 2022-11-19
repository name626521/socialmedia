"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
const verify_jwt_middleware_1 = require("../middleware/verify_jwt.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const roles_1 = require("../config/roles");
const router = express_1.default.Router();
router.get('/get_all', verify_jwt_middleware_1.verifyJWT, (0, authorize_middleware_1.authorized)(roles_1.roleList.admin), message_controller_1.default.readAllMessages);
router.patch('/update/:id', verify_jwt_middleware_1.verifyJWT, message_controller_1.default.updateMessage);
router.delete('/delete/:id', verify_jwt_middleware_1.verifyJWT, message_controller_1.default.deleteMessage);
router.get('/show/:id', verify_jwt_middleware_1.verifyJWT, message_controller_1.default.readMessage);
exports.default = router;
