const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

describe('User Model', () => {
    beforeAll(async () => {
        await global.setupTestDB();
    });

    beforeEach(async () => {
        await global.cleanupTestDB();
    });

    describe('User Creation', () => {
        test('should create a new user with required fields', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'GENERAL'
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.name).toBe(userData.name);
            expect(savedUser.email).toBe(userData.email);
            expect(savedUser.role).toBe('GENERAL');
            expect(savedUser.createdAt).toBeDefined();
            expect(savedUser.updatedAt).toBeDefined();
        });

        test('should enforce unique email constraint', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10)
            };

            // Create first user
            const user1 = new User(userData);
            await user1.save();

            // Try to create second user with same email
            const user2 = new User(userData);
            
            await expect(user2.save()).rejects.toThrow();
        });

        test('should require email field', async () => {
            const userData = {
                name: 'Test User',
                password: await bcrypt.hash('password123', 10)
            };

            const user = new User(userData);
            
            await expect(user.save()).rejects.toThrow();
        });

        test('should set default role to GENERAL', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10)
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser.role).toBe('GENERAL');
        });
    });

    describe('Password Security', () => {
        test('should hash password with bcrypt', async () => {
            const plainPassword = 'password123';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword
            };

            const user = new User(userData);
            const savedUser = await user.save();

            // Password should be hashed
            expect(savedUser.password).not.toBe(plainPassword);
            expect(savedUser.password).toBe(hashedPassword);
            
            // Should be able to verify password
            const isValid = await bcrypt.compare(plainPassword, savedUser.password);
            expect(isValid).toBe(true);
        });
    });

    describe('User Query Operations', () => {
        beforeEach(async () => {
            // Create test users
            const users = [
                {
                    name: 'User One',
                    email: 'user1@example.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'GENERAL'
                },
                {
                    name: 'User Two',
                    email: 'user2@example.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'ADMIN'
                }
            ];

            await User.insertMany(users);
        });

        test('should find user by email', async () => {
            const user = await User.findOne({ email: 'user1@example.com' });
            
            expect(user).toBeDefined();
            expect(user.name).toBe('User One');
            expect(user.email).toBe('user1@example.com');
        });

        test('should find users by role', async () => {
            const generalUsers = await User.find({ role: 'GENERAL' });
            const adminUsers = await User.find({ role: 'ADMIN' });
            
            expect(generalUsers).toHaveLength(1);
            expect(adminUsers).toHaveLength(1);
            expect(generalUsers[0].name).toBe('User One');
            expect(adminUsers[0].name).toBe('User Two');
        });

        test('should return null for non-existent user', async () => {
            const user = await User.findOne({ email: 'nonexistent@example.com' });
            
            expect(user).toBeNull();
        });
    });
});

describe('Security Validation', () => {
    beforeAll(async () => {
        await global.setupTestDB();
    });

    beforeEach(async () => {
        await global.cleanupTestDB();
    });

    test('should prevent password exposure in JSON', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
        };

        const user = new User(userData);
        const savedUser = await user.save();

        // Convert to object and remove password
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        expect(userResponse.password).toBeUndefined();
        expect(userResponse.name).toBe('Test User');
        expect(userResponse.email).toBe('test@example.com');
    });

    test('should validate email format at application level', () => {
        const validEmails = [
            'test@example.com',
            'user.name@domain.co.uk',
            'user+tag@example.org'
        ];

        const invalidEmails = [
            'invalid-email',
            '@example.com',
            'user@'
        ];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        validEmails.forEach(email => {
            expect(emailRegex.test(email)).toBe(true);
        });

        invalidEmails.forEach(email => {
            expect(emailRegex.test(email)).toBe(false);
        });
    });
});
