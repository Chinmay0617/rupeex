
import 'dotenv/config'; // Load env vars before anything else
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

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // Allow all origins for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});




import dbConnect from './src/lib/db.js';

// ... (other imports)

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await dbConnect();
    console.log("MongoDB database connection established successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit process in serverless, just log
  }
};

// Initial connection for local dev
connectToDB();

// Middleware to ensure DB is connected for every request (crucial for Vercel)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await dbConnect();
      next();
    } catch (err) {
      console.error("MongoDB connection failed in middleware:", err);
      res.status(500).json({ msg: "Database connection failed" });
    }
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send('Rupeex backend is running!');
});

app.use('/api/auth', authRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/seed', seedRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/users', usersRouter);

import { fileURLToPath } from 'url';

// ... (existing imports)

// ...

export default app;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}
