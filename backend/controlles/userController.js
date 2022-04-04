const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncErrorHandler = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const {isAuthenticated} = require('../middleware/auth');
const crypto = require('crypto');
const { use } = require('express/lib/router');

//register a user

exports.registerUesr = CatchAsyncErrorHandler(
    async (req, res, next) => {
        const { name, email, password,role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "this is a sample image",
                url: "mypic"
            }, role
        });
        
        sendToken(user, 201, res);
    }
);


// login of a user

exports.loginUser = CatchAsyncErrorHandler(
    async function (req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter Email and Password", 400))
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401))
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401))
        }

        

        sendToken(user, 200, res);

    }
);

// logout the user

exports.logout = CatchAsyncErrorHandler(
    async function (req, res, next) {
        
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
);

// Forget Password  
exports.forgetPassword = CatchAsyncErrorHandler(async (req, res, next) => {
    // const { email } = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    // Get password reset token
    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email with the token
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your Password Reset link is :- \n\n ${resetPasswordUrl}\nPlease follow this link to reset your password\nIf you have not requested, then please contact support.`;
    try {
        await sendEmail({
            email: user.email,
            subject: `yourShope Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email has been sent to ${user.email}. Follow the instructions to reset your password.`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
});

// reset Password

exports.resetPassword = CatchAsyncErrorHandler(async (req, res, next) => {
    //create token hash 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return next(new ErrorHandler("Reset link is invalid or has been expired", 500));
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match", 500));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});


//get user details

exports.getUserDetails = CatchAsyncErrorHandler(async function (req, res, next) {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
         user
    });
});

//update user password

exports.updateUserPassword = CatchAsyncErrorHandler(async function (req, res, next) {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password mismatch", 404))
    }
    if (req.body.newPassword !== req.body.confirmPassword) { 
        return next(new ErrorHandler("Password and confirm password do not match", 500))
    }
    user.password = req.body.newPassword;
    user.save();
    sendToken(user, 200, res);
});

// Update Profile 
exports.updateUserProfile = CatchAsyncErrorHandler(async function (req, res, next) {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        // avatar: { we will add it later
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndUpdate: true
    });
    res.status(200).json({
        success: true,

    });
});

// get all user details Admin

exports.getAllUserDetails = CatchAsyncErrorHandler(async function (req, res, next) {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});
 

// Get a single user by admin
exports.getSingleUser = CatchAsyncErrorHandler(async function (req, res, next) {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler(`User not found with ${req.params.id}`, 404));
    res.status(200).json({
        success: true,
        user
    });
});

// Update User Role (Admin)

exports.updateUserRole = CatchAsyncErrorHandler(async function (req, res, next) {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndUpdate: true
    });
    res.status(200).json({
        success: true,
        user
    });
});


// Delete user Admin
exports.deleteUser = CatchAsyncErrorHandler(async function (req, res, next) {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler(`User not found with ${req.params.id}`, 404));
    user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

