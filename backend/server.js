import cors from "cors";
app.use(cors({
  origin: "*", // or ["https://your-vercel-site.vercel.app"]
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';

// Route imports
import bookRoutes from './routes/bookRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:8089', 'http://127.0.0.1:8089'],
  credentials: true
}));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Mount routers
app.use('/api/books', bookRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/games', gameRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: 'Library Portal API is running!',
        timestamp: new Date().toISOString(),
        endpoints: {
            books: '/api/books',
            students: '/api/students',
            borrow: '/api/borrow',
            waitlist: '/api/waitlist',
            games: '/api/games'
        }
    });
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📚 Library Portal API available at http://localhost:${PORT}`);
});
