/**
 * Global Error Handler Middleware
 *
 * Catches any error passed via next(err) in route handlers.
 * Returns a consistent JSON error response.
 *
 * Usage: app.use(errorHandler) — must be registered AFTER all routes.
 */
const errorHandler = (err, req, res, next) => {
  // Log error stack for debugging in dev mode
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
