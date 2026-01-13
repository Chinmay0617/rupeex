# 🗄️ MongoDB Setup Guide for RupeeX

## Prerequisites

1. **MongoDB** installed and running locally OR MongoDB Atlas account
2. **Node.js** v18+

## Setup Steps

### 1. Configure MongoDB Connection

Create/update `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/rupeex
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rupeex

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Seed the Database

Run the seed script to populate MongoDB with demo data:

```bash
npm run seed:db
```

This will create:
- ✅ 1 Demo user (demo@rupeex.com / demo123)
- ✅ 25 Transactions
- ✅ 6 Budget categories
- ✅ 3 Savings goals

### 3. Start the Application

```bash
npm run dev
```

This starts:
- Frontend (Vite) on `http://localhost:3000`
- Backend (Express) on `http://localhost:5000`

### 4. Login

Navigate to `http://localhost:3000` and login with:

```
Email:    demo@rupeex.com
Password: demo123
```

## Verify MongoDB Data

### Using MongoDB Compass

1. Connect to `mongodb://localhost:27017`
2. Select database: `rupeex`
3. Check collections:
   - `users` (1 document)
   - `transactions` (25 documents)
   - `budgets` (6 documents)
   - `savingsgoals` (3 documents)

### Using MongoDB Shell

```bash
mongosh
use rupeex
db.users.find()
db.transactions.count()
db.budgets.find()
db.savingsgoals.find()
```

## Troubleshooting

### Error: "MONGO_URI is not defined"
- Make sure `.env` file exists in root directory
- Check that `MONGO_URI` is set correctly

### Error: "connect ECONNREFUSED"
- MongoDB is not running
- Start MongoDB: `mongod` (or `brew services start mongodb-community` on Mac)

### Error: "JWT_SECRET is not defined"
- Add `JWT_SECRET` to your `.env` file

## Reset Database

To clear all data and re-seed:

```bash
npm run seed:db
```

The script automatically clears existing data before seeding.

## MongoDB Atlas Setup (Cloud)

If using MongoDB Atlas:

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Get connection string
5. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rupeex?retryWrites=true&w=majority
   ```

## Current Status

✅ MongoDB Models Created:
- User
- Transaction
- Budget
- SavingsGoal

✅ API Routes:
- `/api/auth/signup` - Create new user
- `/api/auth/login` - Login user

⚠️ TODO: Create API routes for:
- Transactions CRUD
- Budgets CRUD
- Goals CRUD

(Frontend currently uses localStorage, needs to be updated to use API)
