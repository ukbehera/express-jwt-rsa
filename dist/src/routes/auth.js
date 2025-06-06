"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Register
router.post('/register', validation_1.registerValidation, authController_1.register);
// Login
router.post('/login', validation_1.loginValidation, authController_1.login);
// Refresh Token
router.post('/refresh', authController_1.refresh);
// Logout
router.post('/logout', authController_1.logout);
exports.default = router;
