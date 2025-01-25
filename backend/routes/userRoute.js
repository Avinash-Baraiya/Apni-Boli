import express from "express";
import { fetchLeaderboard, getProfile, loginUser, logoutUser, registerUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router(); // router object is created to handle the routes

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",isAuthenticated,getProfile);
router.get("/logout",isAuthenticated, logoutUser);
router.get("/leaderboard", fetchLeaderboard);


export default router;

