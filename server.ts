
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import geminiRouter from './routes/gemini.js';
import seedRouter from './routes/seed.js';
import transactionsRouter from './routes/transactions.js';
import budgetsRouter from './routes/budgets.js';
import goalsRouter from './routes/goals.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is not defined in the .env file");
  process.exit(1);
}


mongoose.connect(uri, {
  dbName: 'rupeex_main'
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

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
