import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary";
import { generateToken } from "../utils/jsonToken.js";

export const registerUser = catchAsyncError (async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required", 400));
  }

  const { profileImage } = req.files;

  //
  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

    if (!userName || !email || !password || !phone || !address || !role) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    if (role === "Auctioneer") {
        if (!bankAccountNumber || !bankAccountName || !bankName) {
            return next(new ErrorHandler("Please provide full bank details", 400));
        }
    }

    if (!easypaisaAccountNumber) {
        if (!easypaisaAccountNumber) {
            return next(new ErrorHandler("Please provide easypaisa account number", 400));
        }
    }

    if (!paypalEmail) {
        if (!paypalEmail) {
            return next(new ErrorHandler("Please provide paypal email", 400));
        }
    }

    const isRegistered = await User.findOne({ email });

    if (isRegistered) {
        return next(new ErrorHandler("User already registered", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
        folder: "mern-auction/profileImages",
    });


    // ye tabhi aayega jab invalid image format hoga ya internal server error aayega
    if(!cloudinaryResponse) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error.message || "Unknown Cloudinary Error"
        );

        return next(new ErrorHandler("Failed to upload image to cloudinary", 500));
    }

    const user = await User.create({
        userName,
        email,
        password,
        phone,
        address,
        role,
        profileImage: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        paymentMethods: {
            bankTransfer: {
                bankAccountNumber,
                bankAccountName,
                bankName,
            },
            easypaisa: {
                easypaisaAccountNumber,
            },
            paypal: {
                paypalEmail,
            },
        },
    });
    
    // yaha hum token generate kar rahe hain
    generateToken(user, "User registered successfully", 201, res);
});  

export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    generateToken(user, "User logged in successfully", 200, res);
});

export const getProfile = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

export const fetchLeaderboard = catchAsyncError(async (req, res, next) => {
  const users = await User.find({moneySpent: {$gt: 0}});

  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);

  res.status(200).json({
    success: true,
    leaderboard,
  });


});


