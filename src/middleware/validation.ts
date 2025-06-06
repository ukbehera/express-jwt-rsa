import { check } from 'express-validator';

export const registerValidation = [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

export const loginValidation = [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password is required').notEmpty(),
]; 