import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGO_URI;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cached = (global as any).mongoose = {
        conn: null,
        promise: null,
    };
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('Missing MONGODB_URL or MONGO_URI');

    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: 'fashfolio',
            bufferCommands: false,
        }).then((mongoose) => {
            console.log('✅ Connected to MongoDB Atlas (Cloud)');
            return mongoose;
        }).catch((err) => {
            console.log('❌ Cloud Connection Error:', err);
            throw err;
        });

    cached.conn = await cached.promise;

    return cached.conn;
};
