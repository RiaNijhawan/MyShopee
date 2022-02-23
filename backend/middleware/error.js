const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";


// Mongo Db error
  
  if (err.name == "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    err = new ErrorHandler(message,400);
  }

  // Mongoose Duplicate Key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name == "jsonWebTokenError") {
    const message = `Invalid Token, please try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expire token
  if (err.name === "TokenExpiredError") {
    const message = `Token Expired, please try again`;
    err = new ErrorHandler(message, 400);
  }


  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};