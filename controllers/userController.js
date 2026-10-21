const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');

// Helper to check valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Task 1: Create a new user (POST /api/users)
 * @access  Public
 */
const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Validation: Check required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Please provide fullName, email, and password.',
      });
    }

    // 2. Validation: Full name length
    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Full name must be at least 2 characters long.',
      });
    }

    // 3. Validation: Email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Please provide a valid email address.',
      });
    }

    // 4. Validation: Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Password must be at least 6 characters long.',
      });
    }

    // 5. Validation: Ensure email is unique
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email address already registered. Please use another email.',
      });
    }

    // 6. Create user (password is automatically hashed by Mongoose pre-save hook)
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Task 2: Get all users (GET /api/users)
 * @access  Public
 */
const getAllUsers = async (req, res, next) => {
  try {
    // Passwords are excluded by default in schema (select: false)
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Task 3: Get user by ID (GET /api/users/:id)
 * @access  Public
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid user ID format: '${id}'. Must be a 24-character hexadecimal string.`,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Task 4: Update user (PUT /api/users/:id)
 * @access  Public
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, password } = req.body;

    // 1. Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid user ID format: '${id}'. Must be a 24-character hexadecimal string.`,
      });
    }

    // 2. Check if at least one field is provided for update
    if (!fullName && !email && !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update (fullName, email, or password).',
      });
    }

    // 3. Find existing user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${id}`,
      });
    }

    // 4. Update and validate fullName if provided
    if (fullName !== undefined) {
      if (fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed: Full name must be at least 2 characters long.',
        });
      }
      user.fullName = fullName.trim();
    }

    // 5. Update and validate email if provided
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!validator.isEmail(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed: Please provide a valid email address.',
        });
      }

      // Check if another user is already using this email
      const emailUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });
      if (emailUser) {
        return res.status(400).json({
          success: false,
          message: 'Email address already in use by another user.',
        });
      }

      user.email = normalizedEmail;
    }

    // 6. Update and validate password if provided
    if (password !== undefined) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed: Password must be at least 6 characters long.',
        });
      }
      // Re-hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 7. Save updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Task 5: Delete user by ID (DELETE /api/users/:id)
 * @access  Public
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid user ID format: '${id}'. Must be a 24-character hexadecimal string.`,
      });
    }

    // 2. Find and delete user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      data: {
        id: deletedUser._id,
        fullName: deletedUser.fullName,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
