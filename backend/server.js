import dotenv from 'dotenv';
import app from './app.js';
import { dbConnection } from './database/dbConnection.js';
import http from 'http';

// Load environment variables
dotenv.config();

// Connect to database
dbConnection();

// Create HTTP server
const server = http.createServer(app);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export { server };
