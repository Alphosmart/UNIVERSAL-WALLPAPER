const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../middleware/validation');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    
    // Add validation to signup route
    app.post('/signup', validateUserRegistration, (req, res, next) => {
        const result = handleValidationErrors(req, res, next);
        if (result) return result;
        next();
    }, require('../controller/userSignUp'));
    
    // Add validation to signin route
    app.post('/signin', validateUserLogin, (req, res, next) => {
        const result = handleValidationErrors(req, res, next);
        if (result) return result;
        next();
    }, require('../controller/userSignin'));
    
    return app;
};

describe('Authentication Controllers', () => {
    let app;

    beforeAll(async () => {
        await global.setupTestDB();
        app = createTestApp();
    });

    beforeEach(async () => {
        await global.cleanupTestDB();
    });

    describe('User Registration (userSignUp)', () => {
        const validUserData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Test123!@#'
        };

        test('should register a new user with valid data', async () => {
            const response = await request(app)
                .post('/signup')
                .send(validUserData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User created successfully');
            expect(response.body.data).toHaveProperty('_id');
            expect(response.body.data).not.toHaveProperty('password');
            expect(response.body.data.email).toBe(validUserData.email);
            expect(response.body.data.name).toBe(validUserData.name);
        });

        test('should reject registration with missing name', async () => {
            const invalidData = { ...validUserData };
            delete invalidData.name;

            const response = await request(app)
                .post('/signup')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        test('should reject registration with invalid email', async () => {
            const invalidData = { ...validUserData, email: 'invalid-email' };

            const response = await request(app)
                .post('/signup')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        test('should reject registration with weak password', async () => {
            const invalidData = { ...validUserData, password: '123' };

            const response = await request(app)
                .post('/signup')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        test('should reject duplicate email registration', async () => {
            // Create first user
            await request(app)
                .post('/signup')
                .send(validUserData);

            // Try to create second user with same email
            const response = await request(app)
                .post('/signup')
                .send(validUserData);

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });

        test('should hash password before saving', async () => {
            await request(app)
                .post('/signup')
                .send(validUserData);

            const user = await User.findOne({ email: validUserData.email });
            expect(user.password).not.toBe(validUserData.password);
            
            // Verify password is properly hashed
            const isPasswordValid = await bcrypt.compare(validUserData.password, user.password);
            expect(isPasswordValid).toBe(true);
        });

        test('should prevent arbitrary field injection', async () => {
            const maliciousData = {
                ...validUserData,
                role: 'ADMIN', // Should not be allowed
                isVerified: true, // Should not be allowed
                customField: 'hacker' // Should not be allowed
            };

            const response = await request(app)
                .post('/signup')
                .send(maliciousData);

            expect(response.status).toBe(201);
            
            const user = await User.findOne({ email: validUserData.email });
            expect(user.role).toBe('GENERAL'); // Default role
            expect(user.customField).toBeUndefined();
        });
    });

    describe('User Login (userSignIn)', () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Test123!@#'
        };

        beforeEach(async () => {
            // Create a test user for login tests
            await request(app)
                .post('/signup')
                .send(userData);
        });

        test('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/signin')
                .send({
                    email: userData.email,
                    password: userData.password
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user).not.toHaveProperty('password');
            expect(response.body.data.user.email).toBe(userData.email);

            // Check if cookie is set
            expect(response.headers['set-cookie']).toBeDefined();
        });

        test('should reject login with invalid email', async () => {
            const response = await request(app)
                .post('/signin')
                .send({
                    email: 'wrong@example.com',
                    password: userData.password
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        test('should reject login with invalid password', async () => {
            const response = await request(app)
                .post('/signin')
                .send({
                    email: userData.email,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        test('should reject login with missing email', async () => {
            const response = await request(app)
                .post('/signin')
                .send({
                    password: userData.password
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        test('should reject login with missing password', async () => {
            const response = await request(app)
                .post('/signin')
                .send({
                    email: userData.email
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        test('should set secure cookie on successful login', async () => {
            const response = await request(app)
                .post('/signin')
                .send({
                    email: userData.email,
                    password: userData.password
                });

            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toContain('token=');
            expect(cookies[0]).toContain('HttpOnly');
        });
    });
});

describe('Security Tests', () => {
    let app;

    beforeAll(async () => {
        await global.setupTestDB();
        app = createTestApp();
    });

    beforeEach(async () => {
        await global.cleanupTestDB();
    });

    test('should prevent NoSQL injection in login', async () => {
        // Create a test user
        await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
        });

        // Try NoSQL injection
        const response = await request(app)
            .post('/signin')
            .send({
                email: { $ne: null },
                password: { $ne: null }
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('should sanitize input data', async () => {
        const maliciousData = {
            name: '<script>alert("xss")</script>',
            email: 'test@example.com',
            password: 'Test123!@#'
        };

        const response = await request(app)
            .post('/signup')
            .send(maliciousData);

        expect(response.status).toBe(201);
        
        const user = await User.findOne({ email: 'test@example.com' });
        expect(user.name).not.toContain('<script>');
    });
});
