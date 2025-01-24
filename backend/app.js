import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { connectDB } from './database/connection.js';
import { errorMiddleware } from './middlewares/error.js';
import userRouter from './routes/userRoute.js';

const app = express();

dotenv.config({
    path: "./config/config.env",
});

// const cors = require('cors');
app.use(cors());


app.use(cookieParser()); // to access the cookies 
app.use(express.json()); // to parse json data
app.use(express.urlencoded({ extended: true })); 
app.use(fileUpload(
    {
        useTempFiles: true,
        tempFileDir: '/tmp/',
    }
));

app.use("/api/v1/user",userRouter)

connectDB();
app.use(errorMiddleware);


export default app;
