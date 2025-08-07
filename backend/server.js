import dotenv from 'dotenv';
import app from './app.js';
import { dbConnection } from './database/dbConnection.js';

// Load environment variables
dotenv.config();

// Connect to database
dbConnection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is Running on Port ${PORT}`);
});
