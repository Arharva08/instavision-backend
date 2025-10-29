const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { error } = require('../utils/response');

/**
 * Authentication middleware - verifies JWT token
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'No token provided. Authorization required.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token expired. Please login again.', 401);
    } else if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token. Please login again.', 401);
    }
    return error(res, 'Authentication failed.', 401);
  }
};

/**
 * Authorization middleware - checks if user has required role(s)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized. Please login first.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Access denied. You do not have permission to perform this action.', 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};

