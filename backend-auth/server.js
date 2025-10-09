/**
 * Express Server with Authentication
 * Main entry point for the backend
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AboutMe Authentication API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        logout: 'POST /auth/logout'
      },
      user: {
        me: 'GET /user/me (Protected)',
        all: 'GET /user/all (Protected)'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🚀 AboutMe Authentication Server                         ║
║                                                            ║
║  ✅ Server running on: http://localhost:${PORT}           ║
║  ✅ Environment: ${process.env.NODE_ENV || 'development'}                    ║
║  ✅ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3001'}   ║
║                                                            ║
║  📡 Available endpoints:                                   ║
║     POST /auth/register  - Register new user              ║
║     POST /auth/login     - Login user                     ║
║     POST /auth/logout    - Logout user                    ║
║     GET  /user/me        - Get current user (Protected)   ║
║     GET  /user/all       - Get all users (Protected)      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
