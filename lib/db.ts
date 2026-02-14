import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
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
    // Clear cache if connection failed previously
    if (cached.conn) {
        return cached.conn;
    }

    // Always clear the cached promise to ensure we use fresh connection with current env vars
    cached.promise = null;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        console.log("Connecting to MongoDB...");
        console.log("Using URI:", MONGODB_URI!.substring(0, 50) + "...");
        cached.conn = await cached.promise;
        console.log("MongoDB Connected Successfully");
    } catch (e) {
        cached.promise = null;
        cached.conn = null; // Also clear the connection
        console.error("MongoDB Connection Error:", e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
