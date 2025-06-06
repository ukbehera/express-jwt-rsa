"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const logger_1 = __importDefault(require("../utils/logger"));
const register = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    logger_1.default.info(req.body, 'Email and Password in the request');
    const { email, password } = req.body;
    try {
        const existingUser = await User_1.default.exists({ email });
        logger_1.default.info(existingUser, 'User find query resp from DB');
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = new User_1.default({ email, password });
        await user.save();
        logger_1.default.info('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        logger_1.default.info(error, 'Error while registering user');
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const payload = { userId: user._id.toString() };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)(payload);
        const refreshTokenDoc = new RefreshToken_1.default({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
        await refreshTokenDoc.save();
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token required' });
        return;
    }
    try {
        const payload = (0, jwt_1.verifyToken)(refreshToken);
        const tokenDoc = await RefreshToken_1.default.findOne({
            token: refreshToken,
            userId: payload.userId,
        });
        if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
            res.status(401).json({ message: 'Invalid or expired refresh token' });
            return;
        }
        const newAccessToken = (0, jwt_1.signAccessToken)({ userId: payload.userId });
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
exports.refresh = refresh;
const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token required' });
        return;
    }
    try {
        await RefreshToken_1.default.deleteOne({ token: refreshToken });
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.logout = logout;
