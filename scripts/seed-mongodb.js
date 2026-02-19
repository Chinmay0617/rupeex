import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env file');
    process.exit(1);
}

// Define schemas inline
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    baseCurrency: { type: String, default: 'USD' },
});

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY'], default: 'USD' },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
    merchant: String,
    source: { type: String, enum: ['MANUAL', 'AI_NLP', 'AI_SCAN'], default: 'MANUAL' },
    confidence: Number,
    isEdited: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false },
    isRecurring: { type: Boolean, default: false },
    anomalyScore: Number,
}, { timestamps: true });

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    currency: { type: String, enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY'], default: 'USD' },
}, { timestamps: true });

const savingsGoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    currency: { type: String, enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY'], default: 'USD' },
    deadline: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema);

const seedDatabase = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, { dbName: 'rupeex_main' });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Transaction.deleteMany({});
        await Budget.deleteMany({});
        await SavingsGoal.deleteMany({});
        console.log('✅ Existing data cleared');

        // Create demo user with hashed password
        console.log('👤 Creating demo user...');
        const hashedPassword = await bcrypt.hash('demo123', 10);
        const demoUser = new User({
            email: 'demo@rupeex.com',
            password: hashedPassword,
            baseCurrency: 'USD',
        });
        await demoUser.save();
        console.log('✅ Demo user created:', demoUser.email);

        const userId = demoUser._id;

        // Create transactions
        console.log('💰 Creating transactions...');
        const transactions = [
            { userId, date: '2026-01-04', amount: 85.50, currency: 'USD', description: 'Whole Foods Grocery Shopping', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
            { userId, date: '2026-01-04', amount: 3500, currency: 'INR', description: 'Swiggy Food Delivery', category: 'Food & Dining', type: 'EXPENSE', source: 'AI_NLP', confidence: 0.92, isEdited: false, aiGenerated: true, isRecurring: false, anomalyScore: 0.05 },
            { userId, date: '2026-01-03', amount: 45.00, currency: 'USD', description: 'Netflix Subscription', category: 'Entertainment', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
            { userId, date: '2026-01-03', amount: 5000, currency: 'USD', description: 'Monthly Salary - Tech Corp', category: 'Salary', type: 'INCOME', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
            { userId, date: '2026-01-02', amount: 120.00, currency: 'USD', description: 'Nike Running Shoes', category: 'Shopping', type: 'EXPENSE', source: 'AI_SCAN', confidence: 0.88, isEdited: false, aiGenerated: true, isRecurring: false, anomalyScore: 0.3 },
            { userId, date: '2025-12-30', amount: 2500, currency: 'INR', description: 'Uber Ride to Airport', category: 'Transport', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.2 },
            { userId, date: '2025-12-29', amount: 450.00, currency: 'USD', description: 'Electric Bill - December', category: 'Utilities', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0.1 },
            { userId, date: '2025-12-28', amount: 65.00, currency: 'USD', description: 'Starbucks Coffee Beans', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.15 },
            { userId, date: '2025-12-27', amount: 1200, currency: 'USD', description: 'Rent Payment - January', category: 'Rent', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
            { userId, date: '2025-12-26', amount: 89.99, currency: 'USD', description: 'Amazon Prime Membership', category: 'Shopping', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
            { userId, date: '2025-12-24', amount: 250.00, currency: 'USD', description: 'Christmas Dinner Party', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.4 },
            { userId, date: '2025-12-23', amount: 180.00, currency: 'USD', description: 'Gym Membership - Annual', category: 'Health', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
            { userId, date: '2025-12-22', amount: 45.50, currency: 'USD', description: 'Gas Station Fill-up', category: 'Transport', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.05 },
            { userId, date: '2025-12-21', amount: 500, currency: 'USD', description: 'Freelance Web Design Project', category: 'Freelance', type: 'INCOME', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0 },
            { userId, date: '2025-12-20', amount: 75.00, currency: 'USD', description: 'Doctor Consultation', category: 'Health', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
            { userId, date: '2025-12-18', amount: 320.00, currency: 'USD', description: 'Online Course - React Advanced', category: 'Education', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.5 },
            { userId, date: '2025-12-17', amount: 55.00, currency: 'USD', description: 'Movie Tickets - IMAX', category: 'Entertainment', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
            { userId, date: '2025-12-16', amount: 95.00, currency: 'USD', description: 'Grocery Shopping - Target', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
            { userId, date: '2025-12-15', amount: 12.99, currency: 'USD', description: 'Spotify Premium', category: 'Entertainment', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
            { userId, date: '2025-12-14', amount: 200.00, currency: 'USD', description: 'Investment - Stock Purchase', category: 'Investments', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.2 },
            { userId, date: '2025-12-12', amount: 38.50, currency: 'USD', description: 'Restaurant Lunch', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.05 },
            { userId, date: '2025-12-10', amount: 150.00, currency: 'USD', description: 'Clothing Shopping - Zara', category: 'Shopping', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.2 },
            { userId, date: '2025-12-08', amount: 85.00, currency: 'USD', description: 'Internet Bill', category: 'Utilities', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: true, anomalyScore: 0 },
            { userId, date: '2025-12-06', amount: 42.00, currency: 'USD', description: 'Coffee Shop Meetup', category: 'Food & Dining', type: 'EXPENSE', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0.1 },
            { userId, date: '2025-12-05', amount: 1000, currency: 'USD', description: 'Bonus Payment', category: 'Salary', type: 'INCOME', source: 'MANUAL', isEdited: false, aiGenerated: false, isRecurring: false, anomalyScore: 0 }
        ];
        await Transaction.insertMany(transactions);
        console.log(`✅ Created ${transactions.length} transactions`);

        // Create budgets
        console.log('📊 Creating budgets...');
        const budgets = [
            { userId, category: 'Food & Dining', limit: 500, spent: 0, currency: 'USD' },
            { userId, category: 'Shopping', limit: 300, spent: 0, currency: 'USD' },
            { userId, category: 'Transport', limit: 200, spent: 0, currency: 'USD' },
            { userId, category: 'Entertainment', limit: 150, spent: 0, currency: 'USD' },
            { userId, category: 'Utilities', limit: 600, spent: 0, currency: 'USD' },
            { userId, category: 'Health', limit: 250, spent: 0, currency: 'USD' }
        ];
        await Budget.insertMany(budgets);
        console.log(`✅ Created ${budgets.length} budgets`);

        // Create savings goals
        console.log('🎯 Creating savings goals...');
        const goals = [
            { userId, name: 'Emergency Fund', target: 10000, current: 3500, currency: 'USD', deadline: '2026-12-31' },
            { userId, name: 'Vacation to Japan', target: 5000, current: 1200, currency: 'USD', deadline: '2026-06-30' },
            { userId, name: 'New Laptop', target: 2000, current: 800, currency: 'USD', deadline: '2026-03-31' }
        ];
        await SavingsGoal.insertMany(goals);
        console.log(`✅ Created ${goals.length} savings goals`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📧 Login Credentials:');
        console.log('   Email:', demoUser.email);
        console.log('   Password: demo123');
        console.log('\n📊 Data Summary:');
        console.log(`   - ${transactions.length} Transactions`);
        console.log(`   - ${budgets.length} Budgets`);
        console.log(`   - ${goals.length} Savings Goals`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Disconnected from MongoDB');
        process.exit(0);
    }
};

seedDatabase();
