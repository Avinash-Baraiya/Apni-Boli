import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { connectDB } from './database/connection.js';

const app = express();

dotenv.config({
    path: "./config/config.env",
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],// default is GET, POST, PUT, DELETE
    credentials: true, // enable set cookie
}));

app.use(cookieParser()); // to access the cookies 
app.use(express.json()); // to parse json data
app.use(express.urlencoded({ extended: true })); 
app.use(fileUpload(
    {
        useTempFiles: true,
        tempFileDir: '/tmp/',
    }
));

connectDB();


export default app;
