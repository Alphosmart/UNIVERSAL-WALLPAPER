const { AppError, ValidationError, AuthenticationError } = require('../utils/errors');
const { ResponseHandler } = require('../utils/responseHandler');

describe('Custom Error Classes', () => {
    describe('AppError', () => {
        test('should create error with message and status code', () => {
            const error = new AppError('Test error', 400);
            
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Test error');
            expect(error.statusCode).toBe(400);
            expect(error.isOperational).toBe(true);
        });

        test('should default to status code 500', () => {
            const error = new AppError('Test error');
            
            expect(error.statusCode).toBe(500);
        });
    });

    describe('ValidationError', () => {
        test('should create validation error with proper status code', () => {
            const error = new ValidationError('Validation failed');
            
            expect(error).toBeInstanceOf(AppError);
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Validation failed');
            expect(error.statusCode).toBe(400);
        });
    });

    describe('AuthenticationError', () => {
        test('should create authentication error with proper status code', () => {
            const error = new AuthenticationError('Auth failed');
            
            expect(error).toBeInstanceOf(AppError);
            expect(error).toBeInstanceOf(AuthenticationError);
            expect(error.message).toBe('Auth failed');
            expect(error.statusCode).toBe(401);
        });
    });
});

describe('ResponseHandler', () => {
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe('success responses', () => {
        test('should return success response', () => {
            const data = { id: 1, name: 'Test' };
            ResponseHandler.success(res, data, 'Operation successful');

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    error: false,
                    message: 'Operation successful',
                    data,
                    timestamp: expect.any(String)
                })
            );
        });

        test('should return created response', () => {
            const data = { id: 1, name: 'Test' };
            ResponseHandler.created(res, data, 'Resource created');

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    error: false,
                    message: 'Resource created',
                    data
                })
            );
        });
    });

    describe('error responses', () => {
        test('should return error response', () => {
            ResponseHandler.error(res, 'Something went wrong', 500);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: true,
                    message: 'Something went wrong',
                    timestamp: expect.any(String)
                })
            );
        });

        test('should return bad request response', () => {
            const errors = ['Field is required'];
            ResponseHandler.badRequest(res, 'Invalid input', errors);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: true,
                    message: 'Invalid input',
                    errors
                })
            );
        });

        test('should return unauthorized response', () => {
            ResponseHandler.unauthorized(res, 'Authentication required');

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: true,
                    message: 'Authentication required'
                })
            );
        });

        test('should return not found response', () => {
            ResponseHandler.notFound(res, 'Resource not found');

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: true,
                    message: 'Resource not found'
                })
            );
        });

        test('should return validation error response', () => {
            const errors = ['Name is required', 'Email is invalid'];
            ResponseHandler.validationError(res, errors, 'Validation failed');

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: true,
                    message: 'Validation failed',
                    errors
                })
            );
        });
    });

    describe('catchAsync wrapper', () => {
        test('should catch and forward async errors', async () => {
            const { catchAsync } = require('../utils/responseHandler');
            const mockFn = jest.fn().mockRejectedValue(new Error('Async error'));
            const next = jest.fn();
            
            const wrappedFn = catchAsync(mockFn);
            await wrappedFn({}, {}, next);
            
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
