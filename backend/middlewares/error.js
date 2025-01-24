// Error class is a built-in class in Node.js
// inherited from the Error class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid. Try Again!!!";
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is expired. Try Again!!!";
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMsg = err.errors
    ? Object.values(err.errors).map((value) => value.message).join(" ")
    : err.message;


  res.status(err.statusCode).json({
    success: false,
    message: errorMsg || "Internal Server Error",
  });
};

export default ErrorHandler;