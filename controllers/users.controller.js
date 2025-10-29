const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');
const { success, error } = require('../utils/response');
const { generateRandomPassword } = require('../utils/passwordGenerator');
const { sendPasswordResetEmail } = require('../utils/emailService');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       profile_image_url:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       updated_at:
 *                         type: string
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT id, full_name, email, college_university, course, batch_no, reg_no, profile_image_url, bio, status, created_at, updated_at, role FROM users ORDER BY created_at DESC'
  );
  
  return success(res, 'Users retrieved successfully', result.rows);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query(
    'SELECT id, full_name, email, college_university, course, batch_no, reg_no, profile_image_url, bio, status, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  
  if (result.rows.length === 0) {
    return error(res, 'User not found', 404);
  }
  
  return success(res, 'User retrieved successfully', result.rows[0]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { full_name, email, college_university, course, batch_no, reg_no } = req.body;
  
  // Check if user exists
  const existingUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
  if (existingUser.rows.length === 0) {
    return error(res, 'User not found', 404);
  }

  // Check if email is already taken by another user
  if (email) {
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
    if (emailCheck.rows.length > 0) {
      return error(res, 'Email already taken by another user', 400);
    }
  }

  // Check if reg_no is already taken by another user
  if (reg_no) {
    const regCheck = await pool.query('SELECT id FROM users WHERE reg_no = $1 AND id != $2', [reg_no, id]);
    if (regCheck.rows.length > 0) {
      return error(res, 'Registration number already taken by another user', 400);
    }
  }

  const result = await pool.query(
    `UPDATE users SET 
     full_name = COALESCE($1, full_name),
     email = COALESCE($2, email),
     college_university = COALESCE($3, college_university),
     course = COALESCE($4, course),
     batch_no = COALESCE($5, batch_no),
     reg_no = COALESCE($6, reg_no),
     updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, full_name, email, college_university, course, batch_no, reg_no, status, created_at, updated_at`,
    [full_name, email, college_university, course, batch_no, reg_no, id]
  );
  
  return success(res, 'User updated successfully', result.rows[0]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if user exists
  const existingUser = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
  if (existingUser.rows.length === 0) {
    return error(res, 'User not found', 404);
  }

  // Prevent deletion of admin users
  if (existingUser.rows[0].role === 'admin') {
    return error(res, 'Cannot delete admin user', 403);
  }

  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  
  return success(res, 'User deleted successfully');
});

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Toggle user status (activate/deactivate)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       404:
 *         description: User not found
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status || !['active', 'inactive'].includes(status)) {
    return error(res, 'Status must be either "active" or "inactive"', 400);
  }

  // Check if user exists
  const existingUser = await pool.query('SELECT id, role, full_name, email FROM users WHERE id = $1', [id]);
  if (existingUser.rows.length === 0) {
    return error(res, 'User not found', 404);
  }

  // Prevent deactivating admin users
  if (existingUser.rows[0].role === 'admin' && status === 'inactive') {
    return error(res, 'Cannot deactivate admin user', 403);
  }

  const result = await pool.query(
    'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, full_name, email, status',
    [status, id]
  );
  
  return success(res, `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`, result.rows[0]);
});

/**
 * @swagger
 * /api/users/{id}/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: User not found
 */
const resetUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if user exists
  const existingUser = await pool.query('SELECT id, full_name, email FROM users WHERE id = $1', [id]);
  if (existingUser.rows.length === 0) {
    return error(res, 'User not found', 404);
  }

  const user = existingUser.rows[0];
  
  // Generate new random password
  const newPassword = generateRandomPassword(12);
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await pool.query(
    'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [hashedPassword, id]
  );

  // Send password reset email
  const emailSent = await sendPasswordResetEmail(user.email, user.full_name, newPassword);
  
  if (!emailSent) {
    console.warn('Failed to send password reset email to:', user.email);
  }

  return success(res, 'Password reset successfully. New password sent to email.');
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword
};

