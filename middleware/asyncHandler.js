/**
 * Wraps async route handlers to catch errors and pass them to error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
module.exports = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

