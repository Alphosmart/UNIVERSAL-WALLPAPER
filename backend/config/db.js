const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB() {
    try {
        const startTime = Date.now();
        
        // Configure mongoose options for MongoDB Atlas with proper timeouts
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: true, // Enable mongoose buffering to handle commands before connection
            connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
            retryWrites: true, // Enable retryable writes
            w: 'majority' // Write concern
        };

        await mongoose.connect(process.env.MONGODB_URI, options);
        
        const connectionTime = Date.now() - startTime;
        logger.info('MongoDB connected successfully', { connectionTime });
        
        // Log database events
        mongoose.connection.on('connected', () => {
            logger.info('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('Mongoose connection error', { error: err.message });
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose disconnected from MongoDB');
        });

        // Log slow queries in development
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', (collectionName, method, query, doc) => {
                logger.debug('MongoDB Query', {
                    collection: collectionName,
                    method,
                    query,
                    doc
                });
            });
        }

        return true;
    } catch (err) {
        logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
        console.log('Continuing without database connection...');
        return false;
    }    
}

module.exports = connectDB