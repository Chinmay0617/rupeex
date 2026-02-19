
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

console.log("Script starting...");

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGO_URI not found in .env file');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    baseCurrency: { type: String, default: 'USD' },
    // Add other fields from your actual User model if strict schema is enforced, 
    // but usually mongoose defaults work.
});

// Avoid OverwriteModelError if running alongside other scripts
const User = (mongoose.models.User || mongoose.model('User', userSchema)) as mongoose.Model<any>;

const createDemoUser = async () => {
    try {
        console.log('🔌 Connecting to MongoDB (rupeex_main)...');
        // IMPORTANT: Must match the app's dbName
        await mongoose.connect(MONGODB_URI, { dbName: 'rupeex_main' });
        console.log('✅ Connected to MongoDB');

        const email = 'demo@rupeex.com';
        const password = 'demo123';

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} already exists.`);
            // Update password just in case
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();
            console.log(`✅ Password updated for ${email} to '${password}'`);
        } else {
            console.log(`Creating new user ${email}...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                email,
                password: hashedPassword,
                baseCurrency: 'USD',
            });
            await user.save();
            console.log(`✅ User created: ${email}`);
        }

    } catch (error) {
        console.error('❌ Error creating demo user:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected');
        process.exit(0);
    }
};

createDemoUser();
