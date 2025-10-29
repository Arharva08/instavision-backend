const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health.routes');
const usersRoutes = require('./users.routes');
const authRoutes = require('./auth.routes');

// Route definitions
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

module.exports = router;

