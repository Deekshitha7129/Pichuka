import mongoose from 'mongoose';
import { error } from '../utils/logger.js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const connectWithRetry = async (retryCount = 0) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'RESTAURANT',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority',
            appName: 'pichuka-restaurant-api',
            autoIndex: process.env.NODE_ENV !== 'production',
        });
        
        console.log('✅ Connected to MongoDB Atlas');
        
        // Connection events
        mongoose.connection.on('error', (err) => {
            error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(() => connectWithRetry(), RETRY_DELAY);
        });
        
    } catch (err) {
        error('MongoDB connection error:', err);
        
        if (retryCount < MAX_RETRIES) {
            console.log(`Retrying connection... (${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => connectWithRetry(retryCount + 1), RETRY_DELAY);
        } else {
            error('Max retries reached. Could not connect to MongoDB.');
            process.exit(1);
        }
    }
};

export const dbConnection = () => {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        error('UNHANDLED REJECTION! 💥 Shutting down...');
        error(err.name, err);
        server.close(() => {
            process.exit(1);
        });
    });

    // Connect to MongoDB
    connectWithRetry();
};
