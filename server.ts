import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import geminiRouter from './routes/gemini.js';
import seedRouter from './routes/seed.js';
import transactionsRouter from './routes/transactions.js';
import budgetsRouter from './routes/budgets.js';
import goalsRouter from './routes/goals.js';
import usersRouter from './routes/users.js';
import dbConnect from './src/lib/db.js';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Handle preflight requests explicitly
// app.options('*', cors(corsOptions));

// Security & Logging Middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health Check Endpoint (Bypass DB Middleware)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
    dbState: mongoose.connection.readyState
  });
});

// Middleware to ensure DB is connected for every request (crucial for Vercel)
app.use(async (req, res, next) => {
  // Skip DB check for health status and preflight OPTIONS requests
  if (req.method === 'OPTIONS' || req.url === '/api/status') {
    return next();
  }

  // Only connect for /api routes
  if (req.url.startsWith('/api')) {
    if (mongoose.connection.readyState !== 1) {
      console.log(`[DB] Connecting for request: ${req.method} ${req.url}`);
      try {
        await dbConnect();
        next();
      } catch (err: any) {
        console.error("MongoDB connection failed in middleware:", err.message);
        res.status(500).json({ msg: "Database connection failed", error: err.message });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send('Rupeex backend is running!');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/seed', seedRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/users', usersRouter);

// 404 handler for API routes
app.use('/api', (req, res) => {
  console.log(`[404] ${req.method} ${req.url}`);
  res.status(404).json({ msg: `API Endpoint not found: ${req.method} ${req.url}` });
});

export default app;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    dbConnect().then(() => {
      console.log("Initial MongoDB connection established");
    }).catch(err => {
      console.error("Initial MongoDB connection failed:", err.message);
    });
  });
}
