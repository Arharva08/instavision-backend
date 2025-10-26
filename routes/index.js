const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health.routes');

// Route definitions
router.use('/health', healthRoutes);

// Add more routes here as you create them
// router.use('/users', require('./users.routes'));
// router.use('/auth', require('./auth.routes'));

module.exports = router;

