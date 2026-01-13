# 🚨 Quick Fix - Server Not Starting

## Problem:
Backend server crash ho raha hai due to ts-node issues with Node.js v22

## ✅ Solution Applied:
1. Created `server.js` (plain JavaScript version)
2. Updated `package.json` to use `server.js` instead of `server.ts`

## 🚀 Next Steps:

### 1. Stop Current Process
```bash
# Terminal mein Ctrl+C press karo
```

### 2. Kill Port 3000 (if needed)
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or simply close any browser tabs on localhost:3000
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Expected Output:
```
[0] VITE v6.4.1  ready in 372 ms
[0] ➜  Local:   http://localhost:3000/
[1] MongoDB database connection established successfully
[1] Server is running on port: 5000
```

## 🔍 If Still Not Working:

### Check 1: MongoDB Connection
Make sure `.env` has:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
```

### Check 2: Dependencies
```bash
npm install
```

### Check 3: Run Backend Separately
```bash
# Terminal 1:
npm run server

# Terminal 2:
npm run dev:frontend
```

## 📝 Files Changed:
- ✅ Created `server.js` (JavaScript version)
- ✅ Updated `package.json` (removed ts-node)
- ✅ Fixed `api.ts` (endpoint URLs + setAuthToken order)

## 🎯 What Should Work Now:
1. Backend starts without ts-node errors
2. Frontend connects to backend
3. Data saves to MongoDB
4. JWT authentication works

---

**Try restarting now!** If still issues, let me know the exact error message.
