import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dbConnection } from './database/dbConnection.js';
import { error as errorHandler } from './middleware/error.js';
import { error as logError, info } from './utils/logger.js';
import reservationRouter from './routes/reservationRoutes.js';
import authRouter from './routes/authRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, 'config/config.env') });

// Create Express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
    : ["http://localhost:5173", "http://localhost:5174"];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.options('*', cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// Limit requests from same API
const limiter = rateLimit({
    max: 100, // 100 requests per windowMs
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', orderRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Handle 404 - Not Found
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// Global error handling middleware
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logError('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logError(`Name: ${err.name}`);
    logError(`Message: ${err.message}`);
    logError(`Stack: ${err.stack}`);
    
    // Close server & exit process
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Initialize database connection
dbConnection();

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    info(`Server running in ${process.env.NODE_ENV} mode on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logError('UNHANDLED REJECTION! 💥 Shutting down...');
    logError(`Name: ${err.name}`);
    logError(`Message: ${err.message}`);
    logError(`Stack: ${err.stack}`);
    
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
    logError('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        logError('💥 Process terminated!');
    });
});

export default app;
