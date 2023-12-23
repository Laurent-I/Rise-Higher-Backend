const User = require('../models/UserModel');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

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
        const token = jwt.sign({userId: newUser._id}, JWT_SECRET);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to register user"});
    }
}