import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return; // already connected
    }

    const url = process.env.NEXT_PUBLIC_MONGODB_URI;

    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }
};