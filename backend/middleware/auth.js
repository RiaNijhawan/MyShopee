const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncErrorHandler = require('./catchAsyncErrors');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

exports.isAuthenticatedUser = CatchAsyncErrorHandler(async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);
  
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SCERET);
  
    req.user = await User.findById(decodedData.id);
  
    next();
});
  
exports.authRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`, 403));
    }
    next();
  }
}