import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import { registerValidation, loginValidation } from '../middleware/validation';

const router = express.Router();

// Register
router.post('/register', registerValidation, register);

// Login
router.post('/login', loginValidation, login);

// Refresh Token
router.post('/refresh', refresh);

// Logout
router.post('/logout', logout);

export default router;