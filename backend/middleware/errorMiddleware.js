// Custom error classes for better error handling
class AppError extends Error {
    constructor(message, statusCode, name = 'AppError') {
        super(message);
        this.statusCode = statusCode;
        this.name = name;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, details = []) {
        super(message, 400, 'ValidationError');
        this.details = details;
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NotFoundError');
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UnauthorizedError');
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access') {
        super(message, 403, 'ForbiddenError');
    }
}

class DuplicateKeyError extends AppError {
    constructor(field, value) {
        super(`Duplicate field value: ${field} '${value}' already exists`, 400, 'DuplicateKeyError');
    }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Development logging
    if (process.env.NODE_ENV === 'development') {
        console.log('❌ Error Stack:', err.stack);
        console.log('📋 Error Details:', {
            name: err.name,
            message: err.message,
            code: err.code,
            keyValue: err.keyValue,
            path: err.path,
            value: err.value
        });
        console.log('🌐 Request Details:', {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    }

    // Production logging (more concise)
    if (process.env.NODE_ENV === 'production') {
        console.error('🚨 Error:', {
            message: err.message,
            name: err.name,
            url: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }

    // Handle different error types
    switch (err.name) {
        case 'CastError':
            error = new NotFoundError(`Resource not found with id of ${err.value}`);
            break;

        case 'ValidationError':
            const messages = Object.values(err.errors).map(val => val.message);
            error = new ValidationError('Validation failed', messages);
            break;

        case 'MongoError':
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                const value = err.keyValue[field];
                error = new DuplicateKeyError(field, value);
            } else {
                error = new AppError('Database error occurred', 500, 'DatabaseError');
            }
            break;

        case 'MongoNetworkError':
            error = new AppError('Database connection failed', 503, 'NetworkError');
            break;

        case 'JsonWebTokenError':
            error = new UnauthorizedError('Invalid authentication token');
            break;

        case 'TokenExpiredError':
            error = new UnauthorizedError('Authentication token expired');
            break;

        default:
            // If it's one of our custom AppError classes
            if (err instanceof AppError) {
                error = err;
            } else {
                // Generic error
                error = new AppError(
                    err.message || 'Internal Server Error',
                    err.statusCode || 500,
                    err.name || 'InternalError'
                );
            }
    }

    // Send error response
    const errorResponse = {
        success: false,
        error: {
            message: error.message,
            code: error.name,
            ...(error.details && { details: error.details }),
            ...(process.env.NODE_ENV === 'development' && { 
                stack: error.stack,
                originalError: err.message 
            })
        },
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    };

    // Additional debug info in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.debug = {
            method: req.method,
            headers: req.headers,
            body: req.body,
            query: req.query,
            params: req.params
        };
    }

    res.status(error.statusCode || 500).json(errorResponse);
};

// Async error handler wrapper (for async functions)
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler middleware (for undefined routes)
const notFound = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};

export default errorHandler;
export { 
    asyncHandler, 
    notFound, 
    AppError, 
    ValidationError, 
    NotFoundError, 
    UnauthorizedError, 
    ForbiddenError, 
    DuplicateKeyError 
};