const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const valid = require("validator");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }
    if (!name || !email || !password) {
      return res.json({ message: "All Fields are Required", success: false });
    }
    if (!valid.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid Email Format", success: false });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, //1h
      })
      .json({
        message: "User created Successfully",
        data: userResponse,
        token,
        success: true,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "server error", error: error.message, success: false });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }
    console.log("Password from request:", password);
    console.log("User from DB:", user);
    console.log("Hashed password:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    //const userResponse = user.toObject();
    //delete userResponse.password;
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, //1h
      })
      .json({
        message: "Login successful",
        data: userResponse,
        token,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.logoutUser = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logged out successfully", success: true });
};
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    //const userId = req.user.userId;
    const user = await User.findById(req.user.userId).select("name email");
    console.log(user);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
