const jwt = require('jsonwebtoken');
const authToken = require('../middleware/authToken');

// Mock the ResponseHandler
jest.mock('../utils/responseHandler', () => ({
    ResponseHandler: {
        serverError: jest.fn((res, message) => {
            return res.status(500).json({
                success: false,
                error: true,
                message
            });
        })
    }
}));

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
        
        // Clear console mocks
        jest.clearAllMocks();
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
