/**
 * User Routes
 * Handles user-related operations
 */

import express from 'express';
import { getCurrentUser, getAllUsers } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /user/me
 * @desc    Get current user information
 * @access  Private (requires authentication)
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   GET /user/all
 * @desc    Get all users (admin only - for future implementation)
 * @access  Private
 */
router.get('/all', authenticateToken, getAllUsers);

export default router;
