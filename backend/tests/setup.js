// Global test setup
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Setup before all tests
beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.TOKEN_SECRET_KEY = 'test-token-secret';
});

// Cleanup after all tests
afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongod) {
        await mongod.stop();
    }
});

// Setup test database connection
global.setupTestDB = async () => {
    if (!mongod) {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    }
};

// Cleanup test database
global.cleanupTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
};

// Mock console methods to reduce test noise
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
