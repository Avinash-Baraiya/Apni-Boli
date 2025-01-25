import { User } from "../models/userSchema.js"; // Import the User model

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken(); // Generate JWT token

  // Set the cookie expiration time to 7 days (in milliseconds)
  const cookieExpireTime =
    (process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000; // 7 days

  const options = {
    expires: new Date(Date.now() + cookieExpireTime), // Expiry set to 7 days
    httpOnly: true, // Makes cookie inaccessible from JavaScript (enhanced security)
  };

  // Set the token in a secure HTTP-only cookie
  res.status(statusCode).cookie("token", token).json({
    success: true,
    message,
    user,
    token,
  });
};
