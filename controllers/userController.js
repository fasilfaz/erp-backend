const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Response formatter utility
const formatResponse = (success, message, data = null, error = null) => ({
  success,
  message,
  data,
  error
});

/**
 * User Login Controller
 * @route POST /api/auth/login
 */
const loginController = async (req, res) => {
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', null, errors.array()));
    }

    const { userId, password } = req.body;

    // Find user
    const user = await User.findOne({ userId, verified: true }).select('+password');
    if (!user) {
      return res.status(401).json(formatResponse(false, 'Invalid credentials'));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(formatResponse(false, 'Invalid credentials'));
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(formatResponse(true, 'Login successful', {
      user: userResponse,
      token
    }));

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(formatResponse(false, 'Internal server error', null, error.message));
  }
};

/**
 * User Registration Controller
 * @route POST /api/auth/register
 */
const registerController = async (req, res) => {
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', null, errors.array()));
    }

    const { userId, password, email, ...otherFields } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ userId }, { email }] 
    });
    
    if (existingUser) {
      return res.status(409).json(
        formatResponse(false, 'User already exists with this userId or email')
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      userId,
      email,
      password: hashedPassword,
      verified: true, // You might want to implement email verification
      ...otherFields
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(formatResponse(true, 'User registered successfully', {
      user: userResponse,
      token
    }));

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(formatResponse(false, 'Internal server error', null, error.message));
  }
};

/**
 * Request Password Reset Controller
 * @route POST /api/auth/request-reset
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(formatResponse(false, 'User not found'));
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Here you would typically send an email with the reset link
    // For this example, we'll just return the token
    res.status(200).json(formatResponse(true, 'Password reset token generated', { resetToken }));

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json(formatResponse(false, 'Internal server error', null, error.message));
  }
};

/**
 * Reset Password Controller
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.userId,
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json(formatResponse(false, 'Invalid or expired reset token'));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json(formatResponse(true, 'Password reset successful'));

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json(formatResponse(false, 'Internal server error', null, error.message));
  }
};

module.exports = {
  loginController,
  registerController,
  requestPasswordReset,
  resetPassword
};