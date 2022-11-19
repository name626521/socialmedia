"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const Logger_1 = __importDefault(require("./library/Logger"));
const server_1 = __importDefault(require("./utils/server"));
// import multer from 'multer'
// import path from 'path'
/** Connect to mnogodb */
mongoose_1.default.connect(config_1.config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    Logger_1.default.info('Connected to mnogodb');
    startServer();
}).catch(err => {
    Logger_1.default.error('Error connecting to mnogodb');
    Logger_1.default.error(err);
});
/** If mongodb connects */
const startServer = () => {
    const router = (0, server_1.default)();
    // const storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, path.resolve('./src/photos'))
    //     },
    //     filename: (req, file, cb) => {
    //         cb(null, Date.now() + path.extname(file.originalname))
    //         console.log('File: ', file)
    //         console.log(path.resolve('./src/photos'))
    //     }
    // })
    // const upload = multer({ storage })
    // router.post('/upload', upload.single('avatar'), (req, res) => {
    //     res.status(200).json({ message: 'img uploaded!' })
    // })
    http_1.default.createServer(router).listen(config_1.config.server.port, () => Logger_1.default.info(`Server listening on ${config_1.config.server.port}`));
};
