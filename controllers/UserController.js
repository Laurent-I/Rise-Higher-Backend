const User = require('../models/UserModel');
const {StatusCodes} = require('http-status-codes');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_SECRET_EXPIRES, EMAIL_PASS, EMAIL_USER, SMTP_PORT, SERVICE} = require('../config');
const userService = require('../services/user.service');

// Register a new user
const registerUser = async(req, res)=> {
    try {
        const {username, email, password, role} = req.body;

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
        const newUser = new User({username, email, password, role});

        // Save the new user to the database
        await newUser.save();
        // Create a JWT token for the new user
        const tokenPayload = {userId: newUser._id, role};
        const token = jwt.sign(tokenPayload, JWT_SECRET, {expiresIn: JWT_SECRET_EXPIRES });

        res.status(StatusCodes.CREATED).json({newUser, token})
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ error: validationErrors });
      }
      console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to register user"});
    }
}

const loginUser = async (req, res) => {
  try {
    // Get the username and password from the request body
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid username or password" });
    }

    // Compare the password given with the password in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id,role:user.role }, JWT_SECRET, { expiresIn: JWT_SECRET_EXPIRES });

    res.status(StatusCodes.OK).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to login user" });
  }
};

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
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

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
const resetPassword = async (req, res) => {
  try {
    // Get the reset token from the request headers
    const resetToken = req.headers.authorization;
    const {newPassword} = req.body

    // Check if the reset token is valid
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid reset token" });
    }

    // Update the user's password in the database
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send response
    res
      .status(StatusCodes.OK)
      .json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to process reset password request" });
  }
};

// Controller function to get all users
const getAllUsers = async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Controller function to get a user by ID
const getUserById = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller function to update a user
  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const userData = req.body;
      const updatedUser = await userService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller function to delete a user
  const deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const deletedUser = await userService.deleteUser(userId);
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller function to update a user's password
  const updatePassword = async (req, res) => {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;
      const updatedUser = await userService.updatePassword(userId, currentPassword, newPassword);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserById,
    updateUser,
    deleteUser,
    updatePassword,
    getAllUsers
}