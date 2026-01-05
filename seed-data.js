/**
 * RupeeX Seed Data Script
 * Run this in browser console to populate with demo data
 */

// Demo User Credentials
const DEMO_USER = {
    email: 'demo@rupeex.com',
    password: 'demo123',
    userId: 'USR-demo2026'
};

// Seed function
function seedRupeeXData() {
    console.log('🌱 Seeding RupeeX with demo data...');

    // 1. Create demo user
    const users = [{
        userId: DEMO_USER.userId,
        email: DEMO_USER.email,
        createdAt: new Date('2025-12-01').toISOString(),
        baseCurrency: 'USD'
    }];
    localStorage.setItem('fintrack_users_db', JSON.stringify(users));

    // 2. Create sample transactions (last 30 days)
    const transactions = [
        // Week 1
        { id: 'tx_001', userId: DEMO_USER.userId, date: '2026-01-04', amount: 85.50, currency: 'USD', description: 'Whole Foods Grocery Shopping', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
        { id: 'tx_002', userId: DEMO_USER.userId, date: '2026-01-04', amount: 3500, currency: 'INR', description: 'Swiggy Food Delivery', category: 'Food & Dining', type: 'EXPENSE', source: 'AI_NLP', confidence: 0.92, isEdited: false, aiGenerated: true, isRecurring: false, anomalyScore: 0.05 },
        { id: 'tx_003', userId: DEMO_USER.userId, date: '2026-01-03', amount: 45.00, currency: 'USD', description: 'Netflix Subscription', category: 'Entertainment', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
        { id: 'tx_004', userId: DEMO_USER.userId, date: '2026-01-03', amount: 5000, currency: 'USD', description: 'Monthly Salary - Tech Corp', category: 'Salary', type: 'INCOME', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
        { id: 'tx_005', userId: DEMO_USER.userId, date: '2026-01-02', amount: 120.00, currency: 'USD', description: 'Nike Running Shoes', category: 'Shopping', type: 'EXPENSE', source: 'AI_SCAN', confidence: 0.88, isEdited: false, aiGenerated: true, isRecurring: false, anomalyScore: 0.3 },

        // Week 2
        { id: 'tx_006', userId: DEMO_USER.userId, date: '2025-12-30', amount: 2500, currency: 'INR', description: 'Uber Ride to Airport', category: 'Transport', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.2 },
        { id: 'tx_007', userId: DEMO_USER.userId, date: '2025-12-29', amount: 450.00, currency: 'USD', description: 'Electric Bill - December', category: 'Utilities', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0.1 },
        { id: 'tx_008', userId: DEMO_USER.userId, date: '2025-12-28', amount: 65.00, currency: 'USD', description: 'Starbucks Coffee Beans', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.15 },
        { id: 'tx_009', userId: DEMO_USER.userId, date: '2025-12-27', amount: 1200, currency: 'USD', description: 'Rent Payment - January', category: 'Rent', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
        { id: 'tx_010', userId: DEMO_USER.userId, date: '2025-12-26', amount: 89.99, currency: 'USD', description: 'Amazon Prime Membership', category: 'Shopping', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },

        // Week 3
        { id: 'tx_011', userId: DEMO_USER.userId, date: '2025-12-24', amount: 250.00, currency: 'USD', description: 'Christmas Dinner Party', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.4 },
        { id: 'tx_012', userId: DEMO_USER.userId, date: '2025-12-23', amount: 180.00, currency: 'USD', description: 'Gym Membership - Annual', category: 'Health', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
        { id: 'tx_013', userId: DEMO_USER.userId, date: '2025-12-22', amount: 45.50, currency: 'USD', description: 'Gas Station Fill-up', category: 'Transport', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.05 },
        { id: 'tx_014', userId: DEMO_USER.userId, date: '2025-12-21', amount: 500, currency: 'USD', description: 'Freelance Web Design Project', category: 'Freelance', type: 'INCOME', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0 },
        { id: 'tx_015', userId: DEMO_USER.userId, date: '2025-12-20', amount: 75.00, currency: 'USD', description: 'Doctor Consultation', category: 'Health', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },

        // Week 4
        { id: 'tx_016', userId: DEMO_USER.userId, date: '2025-12-18', amount: 320.00, currency: 'USD', description: 'Online Course - React Advanced', category: 'Education', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.5 },
        { id: 'tx_017', userId: DEMO_USER.userId, date: '2025-12-17', amount: 55.00, currency: 'USD', description: 'Movie Tickets - IMAX', category: 'Entertainment', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
        { id: 'tx_018', userId: DEMO_USER.userId, date: '2025-12-16', amount: 95.00, currency: 'USD', description: 'Grocery Shopping - Target', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
        { id: 'tx_019', userId: DEMO_USER.userId, date: '2025-12-15', amount: 12.99, currency: 'USD', description: 'Spotify Premium', category: 'Entertainment', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
        { id: 'tx_020', userId: DEMO_USER.userId, date: '2025-12-14', amount: 200.00, currency: 'USD', description: 'Investment - Stock Purchase', category: 'Investments', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.2 },

        // Additional entries
        { id: 'tx_021', userId: DEMO_USER.userId, date: '2025-12-12', amount: 38.50, currency: 'USD', description: 'Restaurant Lunch', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.05 },
        { id: 'tx_022', userId: DEMO_USER.userId, date: '2025-12-10', amount: 150.00, currency: 'USD', description: 'Clothing Shopping - Zara', category: 'Shopping', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.2 },
        { id: 'tx_023', userId: DEMO_USER.userId, date: '2025-12-08', amount: 85.00, currency: 'USD', description: 'Internet Bill', category: 'Utilities', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
        { id: 'tx_024', userId: DEMO_USER.userId, date: '2025-12-06', amount: 42.00, currency: 'USD', description: 'Coffee Shop Meetup', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
        { id: 'tx_025', userId: DEMO_USER.userId, date: '2025-12-05', amount: 1000, currency: 'USD', description: 'Bonus Payment', category: 'Salary', type: 'INCOME', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0 }
    ];
    localStorage.setItem('fintrack_transactions_db', JSON.stringify(transactions));

    // 3. Create budgets
    const budgets = [
        { id: 'bud_001', userId: DEMO_USER.userId, category: 'Food & Dining', limit: 500, spent: 0, currency: 'USD' },
        { id: 'bud_002', userId: DEMO_USER.userId, category: 'Shopping', limit: 300, spent: 0, currency: 'USD' },
        { id: 'bud_003', userId: DEMO_USER.userId, category: 'Transport', limit: 200, spent: 0, currency: 'USD' },
        { id: 'bud_004', userId: DEMO_USER.userId, category: 'Entertainment', limit: 150, spent: 0, currency: 'USD' },
        { id: 'bud_005', userId: DEMO_USER.userId, category: 'Utilities', limit: 600, spent: 0, currency: 'USD' },
        { id: 'bud_006', userId: DEMO_USER.userId, category: 'Health', limit: 250, spent: 0, currency: 'USD' }
    ];
    localStorage.setItem('fintrack_budgets_db', JSON.stringify(budgets));

    // 4. Create savings goals
    const goals = [
        { id: 'goal_001', userId: DEMO_USER.userId, name: 'Emergency Fund', target: 10000, current: 3500, currency: 'USD', deadline: '2026-12-31' },
        { id: 'goal_002', userId: DEMO_USER.userId, name: 'Vacation to Japan', target: 5000, current: 1200, currency: 'USD', deadline: '2026-06-30' },
        { id: 'goal_003', userId: DEMO_USER.userId, name: 'New Laptop', target: 2000, current: 800, currency: 'USD', deadline: '2026-03-31' }
    ];
    localStorage.setItem('fintrack_goals_db', JSON.stringify(goals));

    console.log('✅ Demo data seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Email:', DEMO_USER.email);
    console.log('Password:', DEMO_USER.password);
    console.log('\n🔄 Refresh the page to see the data!');

    return {
        user: DEMO_USER,
        stats: {
            transactions: transactions.length,
            budgets: budgets.length,
            goals: goals.length
        }
    };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 RupeeX Seed Script Loaded');
    console.log('Run: seedRupeeXData() to populate demo data');
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { seedRupeeXData, DEMO_USER };
}
