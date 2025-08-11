const jwt = require('jsonwebtoken');
const authToken = require('../middleware/authToken');
const { validateUserRegistration, handleValidationErrors } = require('../middleware/validation');

describe('Authentication Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {},
            userId: null
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            clearCookie: jest.fn()
        };
        next = jest.fn();
    });

    describe('authToken middleware', () => {
        test('should pass through with valid token', async () => {
            const tokenData = { _id: 'user123', email: 'test@example.com' };
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY);
            req.cookies.token = token;

            await authToken(req, res, next);

            expect(req.userId).toBe('user123');
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should reject request with no token', async () => {
            await authToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Authentication required'),
                    error: true,
                    success: false,
                    redirectTo: '/login',
                    requiresAuth: true
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        test('should reject request with invalid token', async () => {
            req.cookies.token = 'invalid-token';

            await authToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Invalid authentication token'),
                    error: true,
                    success: false,
                    redirectTo: '/login',
                    requiresAuth: true
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        test('should handle expired token', async () => {
            const tokenData = { _id: 'user123', email: 'test@example.com' };
            const expiredToken = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '-1h' });
            req.cookies.token = expiredToken;

            await authToken(req, res, next);

            expect(res.clearCookie).toHaveBeenCalledWith('token');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('session has expired'),
                    error: true,
                    success: false,
                    expired: true,
                    redirectTo: '/login',
                    requiresAuth: true
                })
            );
            expect(next).not.toHaveBeenCalled();
        });
    });
});

describe('Validation Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            validationErrors: []
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    describe('validateUserRegistration', () => {
        test('should pass validation with valid data', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Test123!@#'
            };

            // Run all validations
            for (const validation of validateUserRegistration) {
                await validation.run(req);
            }

            const result = handleValidationErrors(req, res);
            expect(result).toBeNull();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail validation with missing name', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'Test123!@#'
            };

            // Run all validations
            for (const validation of validateUserRegistration) {
                await validation.run(req);
            }

            const result = handleValidationErrors(req, res);
            expect(result).toBeDefined();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail validation with invalid email', async () => {
            req.body = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'Test123!@#'
            };

            // Run all validations
            for (const validation of validateUserRegistration) {
                await validation.run(req);
            }

            const result = handleValidationErrors(req, res);
            expect(result).toBeDefined();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail validation with weak password', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: '123'
            };

            // Run all validations
            for (const validation of validateUserRegistration) {
                await validation.run(req);
            }

            const result = handleValidationErrors(req, res);
            expect(result).toBeDefined();
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
