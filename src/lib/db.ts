
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;


// If MONGO_URI is not set, log an error instead of crashing immediately.
if (!MONGODB_URI) {
    console.warn('Warning: MONGO_URI environment variable is not defined.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        if (!MONGODB_URI) throw new Error("MONGO_URI is not defined.");

        const opts = {
            bufferCommands: false,
            dbName: 'rupeex_main',
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
