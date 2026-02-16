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
    // Check if we have a valid existing connection
    if (cached.conn && mongoose.connection.readyState === 1) {
        console.log("Using existing MongoDB connection");
        return cached.conn;
    }

    // Clear stale connection if it exists but is not connected
    if (cached.conn && mongoose.connection.readyState !== 1) {
        console.log("Clearing stale connection");
        cached.conn = null;
        cached.promise = null;
    }

    // Create new connection promise if needed
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log("Creating new MongoDB connection...");
        console.log("Using URI:", MONGODB_URI!.substring(0, 50) + "...");

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("MongoDB Connected Successfully");
    } catch (e) {
        // Clear both promise and connection on error
        cached.promise = null;
        cached.conn = null;
        console.error("MongoDB Connection Error:", e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
