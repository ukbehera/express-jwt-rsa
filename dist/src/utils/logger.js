"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const isProd = process.env.NODE_ENV === 'production';
const options = {
    level: process.env.LOG_LEVEL || 'info',
    ...(isProd
        ? {}
        : {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss',
                    ignore: 'pid,hostname',
                },
            },
        }),
};
const logger = (0, pino_1.default)(options);
exports.default = logger;
