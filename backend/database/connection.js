import mongoose from "mongoose";

export const connectDB = async () => {  
    mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME, 
    }).then(() => {
        console.log(`MongoDB connected with ${process.env.DB_NAME} database`);
    }
    ).catch((err) => {
        console.log(`error in connecting to MongoDB: ${err}`);
    });
};