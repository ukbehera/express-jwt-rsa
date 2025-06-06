"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Read RSA keys
const privateKey = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../cert/private.pem'), 'utf8');
const publicKey = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../cert/public.pem'), 'utf8');
const signAccessToken = (payload) => {
    const expiresIn = (process.env.JWT_ACCESS_EXPIRY || '15m');
    const options = {
        algorithm: 'RS256',
        expiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, privateKey, options);
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    const options = {
        algorithm: 'RS256',
        expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d'),
    };
    return jsonwebtoken_1.default.sign(payload, privateKey, options);
};
exports.signRefreshToken = signRefreshToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['RS256'] });
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
