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
exports.Schemas = exports.validate_schema = void 0;
const Joi_1 = __importDefault(require("Joi"));
const Logger_1 = __importDefault(require("../library/Logger"));
const validate_schema = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body);
            next();
        }
        catch (err) {
            Logger_1.default.error(err);
            return res.status(422).json({ err });
        }
    });
};
exports.validate_schema = validate_schema;
exports.Schemas = {
    user: {
        create: Joi_1.default.object({
            username: Joi_1.default.string().required().regex(/^[0-9a-zA-Z]+$/).max(24),
            email: Joi_1.default.string().required().email(),
            password: Joi_1.default.string().required().min(8),
        }),
        update: Joi_1.default.object({
            username: Joi_1.default.string().required().regex(/^[0-9a-zA-Z]+$/).max(24)
        })
    }
};
