import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};
export async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        const db = await mongoose.connect(uri, {});

        connection.isConnected = db.connections[0].readyState;

        console.log('MongoDB connected successfully');
    } 
    catch (error) {
        console.log('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default dbConnect;