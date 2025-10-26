module.exports = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Set default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Prepare error response
  const errorResponse = {
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(errorResponse);
};

