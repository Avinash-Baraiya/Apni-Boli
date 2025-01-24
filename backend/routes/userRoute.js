import express from "express";
import { registerUser } from "../controllers/userController.js";

const router = express.Router(); // router object is created to handle the routes

router.post("/register", registerUser);

export default router;

