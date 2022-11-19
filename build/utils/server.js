"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("../library/Logger"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const profile_route_1 = __importDefault(require("../routes/profile.route"));
const post_route_1 = __importDefault(require("../routes/post.route"));
const createServer = () => {
    const router = (0, express_1.default)();
    router.use((req, res, next) => {
        /**Log req */
        Logger_1.default.info(`INCOMING >> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            //Log RES
            Logger_1.default.info(`OUTCOMING >> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express_1.default.urlencoded({
        extended: true
    }));
    router.use((0, cookie_parser_1.default)());
    router.use(express_1.default.json());
    /** Rules to our API */
    router.use((req, res, next) => {
        res.header('Access-control-Allow-Origin', '*');
        res.header('Access-control-Allow-credentials', 'true');
        res.header('Access-control-Allow-Headers', 'X-Requested-With, Content-Type, Origin, Authorization, Accept');
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        }
        next();
    });
    /** Routes */
    router.use('/api/users', user_route_1.default);
    router.use('/api/auth', auth_route_1.default);
    router.use('/api/profile', profile_route_1.default);
    router.use('/api/posts', post_route_1.default);
    /** Health Check */
    router.get('/ping', (req, res) => {
        return res.status(200).json({
            message: 'Pong'
        });
    });
    /** Error Handling */
    router.use((req, res, next) => {
        const error = new Error('Not Found');
        Logger_1.default.error(error);
        return res.status(404).json({
            message: error.message
        });
    });
    return router;
};
exports.default = createServer;
