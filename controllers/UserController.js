const User = require('../models/UserModel');
const {StatusCodes} = require('http-status-codes');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_SECRET_EXPIRES, EMAIL_PASS, EMAIL_USER, SMTP_PORT, SERVICE} = require('../config');

// Register a new user
const registerUser = async(req, res)=> {
    try {
        const {username, email, password} = req.body;

        // Check if the username is already taken
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Username already taken' });
        }

        // Check if the email is already taken
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email already taken' });
        }

        // Create a new user
        const newUser = new User({username, email, password});

        // Save the new user to the database
        await newUser.save();

        // Create a JWT token for the new user
        const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: JWT_SECRET_EXPIRES });

        res.status(StatusCodes.CREATED).json({newUser, token})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to register user"});
    }
}

// Login an existing user
const loginUser = async(req, res)=> {
    try {

        // Get the username and password from the request body
        const {username, password} = req.body;

        // Check if the user exists
        const user = await User.findOne({username});

        // Compare the password given with the password in the database
        const isMatch = await User.comparePassword(password);
        if(!isMatch || !user){
            return res.status(StatusCodes.UNAUTHORIZED).json({error: "Invalid username or password"});
        }
    } catch (error) {
        
    }
}

// Forgot password
const transporter = nodemailer.createTransport({
    service: SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    port: SMTP_PORT
});

const forgotPassword = async(req, res)=> {
    try {
        // Get the email from the request body4
        const {email} = req.body;

        // Check if the user with email exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "No user with that email"});
        }

        // Create a JWT token for the user
        const resetToken = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1h' });

        // Update the user's reset token in the database
        User.resetPasswordToken = resetToken;
        User.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await User.save();

        // Send the password reset email
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Rise Higher Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `To reset your password, click on the following link: ${resetToken}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }
        
        transporter.sendMail(mailOptions, (err, info)=> {
            if(err){
                console.log(err)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to send password reset email"});
            } else {
                console.log('Email sent: ' + info.response)
                return res.status(StatusCodes.OK).json({message: "Password reset email sent"});
            }
        });
    } catch (error) {
        // Handle error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to process forgot password request"});
    }
}

// Reset password
const resetPassword = async(req, res)=> {
    try {
        // Get the reset token from the request body
        const {resetToken, newPassword} = req.body;

        // Check if the reset token is valid
        const user = await User.findOne({resetPasswordToken: resetToken, resetPasswordExpires: {$gt: Date.now()}});
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Invalid reset token"});
        }

        // Update the user's password in the database
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Send response
        res.status(StatusCodes.OK).json({message: "Password reset successfully"});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to process reset password request"});
    }
}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
}