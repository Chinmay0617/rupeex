# 🎯 RupeeX Demo Account

## 📧 Login Credentials

```
Email:    demo@rupeex.com
Password: demo123
```

## 🚀 Quick Start

### Option 1: Browser Console (Recommended)
1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Console tab
4. Copy and paste the entire content of `seed-data.js`
5. Run: `seedRupeeXData()`
6. Refresh the page
7. Login with credentials above

### Option 2: Manual Script Load
1. Open http://localhost:3000
2. Open DevTools Console
3. Run:
```javascript
fetch('/seed-data.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => seedRupeeXData());
```
4. Refresh and login

## 📊 Demo Data Includes

### Transactions (25 entries)
- **Income**: $6,500 (Salary + Freelance + Bonus)
- **Expenses**: ~$5,000 across multiple categories
- **Date Range**: Last 30 days
- **Mix of**: Manual, AI-NLP, and AI-Scan sources
- **Categories**: Food, Shopping, Transport, Utilities, Rent, Entertainment, Health, Education, Investments

### Budgets (6 categories)
- Food & Dining: $500
- Shopping: $300
- Transport: $200
- Entertainment: $150
- Utilities: $600
- Health: $250

### Savings Goals (3 goals)
- Emergency Fund: $3,500 / $10,000
- Vacation to Japan: $1,200 / $5,000
- New Laptop: $800 / $2,000

## 🎨 What to Test

1. **Dashboard**: See net portfolio value, income/expense breakdown
2. **Transactions**: Browse 25+ sample transactions
3. **Currency Switch**: Change from USD → INR in sidebar, watch values convert
4. **Budgets**: View budget utilization across categories
5. **Predictions**: See 30-day forecast based on spending patterns
6. **Reports**: Analyze category breakdown
7. **Advisor**: Ask AI questions about your finances

## 💡 Tips

- Try switching currencies (USD, INR, EUR, GBP, JPY) to see live conversion
- Add new transactions using the "Commit Entry" button
- Toggle dark/light mode with the sun/moon icon
- Edit or delete existing transactions by hovering over them
- Set new budgets or savings goals in the Vaults tab

## 🔄 Reset Data

To start fresh, run in console:
```javascript
localStorage.clear();
location.reload();
```

Then re-run the seed script.
