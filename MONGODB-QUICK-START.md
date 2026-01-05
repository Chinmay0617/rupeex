# 🚀 Quick MongoDB Setup

## Step 1: Check MongoDB is Running

```bash
# Check if MongoDB is running
mongod --version

# If not installed, install MongoDB Community Edition
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb
```

## Step 2: Start MongoDB (if not running)

```bash
# Windows: MongoDB usually starts automatically
# Or run: net start MongoDB

# Mac/Linux:
mongod
# Or: brew services start mongodb-community
```

## Step 3: Update .env File

Create/update `d:/rupeex/.env`:

```env
MONGO_URI=mongodb://localhost:27017/rupeex
JWT_SECRET=rupeex_secret_key_2026
GEMINI_API_KEY=your_existing_gemini_key
```

## Step 4: Seed Database

```bash
cd d:/rupeex
npm run seed:db
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🗑️  Clearing existing data...
✅ Existing data cleared
👤 Creating demo user...
✅ Demo user created: demo@rupeex.com
💰 Creating transactions...
✅ Created 25 transactions
📊 Creating budgets...
✅ Created 6 budgets
🎯 Creating savings goals...
✅ Created 3 savings goals

🎉 Database seeded successfully!

📧 Login Credentials:
   Email: demo@rupeex.com
   Password: demo123
```

## Step 5: Verify Data in MongoDB

### Option A: MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `rupeex`
4. Check collections: users, transactions, budgets, savingsgoals

### Option B: MongoDB Shell
```bash
mongosh
use rupeex
db.users.find().pretty()
db.transactions.count()
db.budgets.find().pretty()
db.savingsgoals.find().pretty()
```

## Troubleshooting

### Error: "connect ECONNREFUSED"
**Solution**: MongoDB is not running. Start it:
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Error: "MONGO_URI is not defined"
**Solution**: Create `.env` file with MONGO_URI

### Error: "MongoServerError: user is not allowed"
**Solution**: Use local MongoDB without authentication:
```env
MONGO_URI=mongodb://localhost:27017/rupeex
```

## Next Steps

After successful seeding:
1. ✅ MongoDB has demo data
2. ⏭️ Frontend needs to be updated to use MongoDB API (instead of localStorage)
3. ⏭️ API routes need to be created for CRUD operations

Currently:
- ✅ Backend server ready (Express + MongoDB)
- ✅ User authentication working
- ❌ Frontend still using localStorage (mock backend)
- ❌ Transaction/Budget/Goal APIs not created yet

**Pehle seed karo, phir main frontend update kar dunga!**
