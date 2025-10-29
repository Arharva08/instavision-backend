const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { success, error } = require('../utils/response');
const { generateRandomPassword } = require('../utils/passwordGenerator');
const { sendRegistrationEmail, sendPasswordResetEmail } = require('../utils/emailService');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new student user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - college_university
 *               - course
 *               - batch_no
 *               - reg_no
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               college_university:
 *                 type: string
 *               course:
 *                 type: string
 *               batch_no:
 *                 type: string
 *               reg_no:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Admin only
 *       403:
 *         description: Forbidden - Admin privileges required
 *       409:
 *         description: User already exists
 */
const register = async (req, res) => {
  try {
    const { full_name, email, college_university, course, batch_no, reg_no } = req.body;

    // Validate required fields
    if (!full_name || !email || !college_university || !course || !batch_no || !reg_no) {
      return error(res, 'Please provide all required fields', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error(res, 'Please provide a valid email address', 400);
    }

    // Check if email already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return error(res, 'User with this email already exists', 409);
    }

    // Check if reg_no already exists
    const existingReg = await pool.query('SELECT id FROM users WHERE reg_no = $1', [reg_no]);
    if (existingReg.rows.length > 0) {
      return error(res, 'User with this registration number already exists', 409);
    }

    // Generate random password
    const randomPassword = generateRandomPassword(12);

    // Hash password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Insert user with 'student' role (admins can only register students)
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, college_university, course, batch_no, reg_no, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, full_name, email, college_university, course, batch_no, reg_no, role, status, created_at`,
      [full_name, email, hashedPassword, college_university, course, batch_no, reg_no, 'student', 'active']
    );

    const user = result.rows[0];

    // Send registration email
    const emailSent = await sendRegistrationEmail(email, full_name, randomPassword, reg_no);
    
    if (!emailSent) {
      console.warn('Failed to send registration email to:', email);
    }

    // Return user data without password
    const userResponse = { ...user };
    delete userResponse.password;
    
    return success(res, 'User registered successfully. Password sent to email.', userResponse, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return error(res, 'Registration failed. Please try again.', 500);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return error(res, 'Please provide email and password', 400);
    }

    // Find user
    const result = await pool.query(
      `SELECT id, full_name, email, password, college_university, course, batch_no, reg_no, role, bio, profile_image_url, status, created_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return error(res, 'Invalid email or password', 401);
    }

    const user = result.rows[0];

    // Check if user is active
    if (user.status !== 'active') {
      return error(res, 'Account is deactivated. Please contact administrator.', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return error(res, 'Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    delete user.password;

    // Return token and user data
    return success(res, 'Login successful', {
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Login failed. Please try again.', 500);
  }
};

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
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, college_university, course, batch_no, reg_no, role, bio, profile_image_url, status, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return error(res, 'User not found', 404);
    }

    return success(res, 'User retrieved successfully', result.rows[0]);
  } catch (err) {
    console.error('Get current user error:', err);
    return error(res, 'Failed to retrieve user data', 500);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};

