import mongoose from "mongoose";

export const connectDB = async () => {  
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Apni_Boli", 
    }).then(() => {
        console.log(`Connected to ${process.env.MONGO_URI} successfully`);
    }
    ).catch((err) => {
        console.log(`error in connecting to MongoDB: ${err}`);
    });
};