const sendToken = function (user, statusCode, res) {
    const token = user.jwt_token();
    //options of cookies 
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIR * 24 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken;