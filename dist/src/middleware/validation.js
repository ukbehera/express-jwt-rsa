"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.check)('email', 'Valid email is required').isEmail(),
    (0, express_validator_1.check)('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];
exports.loginValidation = [
    (0, express_validator_1.check)('email', 'Valid email is required').isEmail(),
    (0, express_validator_1.check)('password', 'Password is required').notEmpty(),
];
