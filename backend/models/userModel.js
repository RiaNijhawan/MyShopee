const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        maxLength: [30, 'Name can not be more than 30 characters'],
        minLength: [3, 'Name can not be less than 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        validator: [validator.isEmail, 'Please add a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: [8, 'Password can not be less than 8 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: [true, 'Please add an avatar']
        },
        url: {
            type: String,
            required: [true, 'Please add an avatar']
        }
    },
    role: {
        type: String,
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

//JWT TOKEN

userSchema.methods.jwt_token = function () {
    return jwt.sign({
        id: this.id
    }, process.env.JWT_SCERET, {
        expiresIn: process.env.JWT_EXP
    });
};

//compare password
userSchema.methods.comparePassword = async function (enterPassword) {
    
    return await bcrypt.compare(enterPassword, this.password);
    
}

//Generating paswword reset token 
userSchema.methods.generateResetToken = function () {
    // generate token 
    const resetToken = crypto.randomBytes(20).toString('hex');

    //hashing and adding to user schema

    this.resetPasswordToken = crypto.createHash('sha256')
        .update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);