const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new student user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Student user created successfully
 *       401:
 *         description: Unauthorized - Login required
 *       403:
 *         description: Forbidden - Admin privileges required
 */
router.post('/register', authenticate, authorize('admin'), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Unauthorized - Login required
 */
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;

