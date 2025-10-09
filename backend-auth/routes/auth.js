/**
 * Authentication Routes
 * Handles registration, login, and logout
 */

import express from 'express';
import { register, login, logout } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /auth/logout
 * @desc    Logout user (client-side removes token)
 * @access  Public
 */
router.post('/logout', logout);

export default router;
