/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */

const checkHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

module.exports = {
  checkHealth
};

