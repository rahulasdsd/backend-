const bcrypt = require('bcrypt');
const UserModel = require("../models/User");
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check for existing user using original UserModel
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists, please login',
        success: false
      });
    }

    // Hash password BEFORE creating user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword // Use hashed password
    });
    await newUser.save();

    res.status(201).json({
      message: "Signup successful", // Changed message
      success: true
    });
  } catch (err) {
    console.error("Signup Error:", err); // Log error for debugging
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errorMsg = 'Authentication failed: email or password is incorrect';

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // FIX: Accept multiple bcrypt hash prefixes
    if (!user.password || !/^\$2[abxy]\$/.test(user.password)) {
      console.error(`Invalid password hash for user: ${email}`);
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name
    });
  } catch (err) {
    console.error("Login Error:", err);
    
    // Handle bcrypt errors
    if (err.message.includes('Invalid salt version') || 
        err.message.includes('data and hash arguments required')) {
      return res.status(500).json({
        message: "Server configuration error",
        success: false,
        details: "Password storage format invalid"
      });
    }
    
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// REMOVED: /reset-password route from here (define separately if needed)

module.exports = { signup, login };
