/**
 * General helper functions
 */

/**
 * Check if value is empty or null
 */
const isEmpty = (value) => {
  return value === null || 
         value === undefined || 
         (typeof value === 'string' && value.trim() === '') ||
         (Array.isArray(value) && value.length === 0) ||
         (typeof value === 'object' && Object.keys(value).length === 0);
};

/**
 * Sanitize string input
 */
const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Generate random string
 */
const randomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Handle async errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  isEmpty,
  sanitize,
  randomString,
  asyncHandler
};

