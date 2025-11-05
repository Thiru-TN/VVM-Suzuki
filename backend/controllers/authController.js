//authController.js

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Otp from "../models/Otp.js";
dotenv.config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER || process.env.EMAIL_USER,
    pass: process.env.MAIL_PASS || process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// OTP generation with proper hashing - FIXED: Consistent expiration time
const generateOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the OTP before storing
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp, salt);
  
  // Delete any existing OTPs for this email to prevent multiple active OTPs
  await Otp.deleteMany({ email });
  
  // Create OTP record with expiration (3 minutes as mentioned in emails)
  await Otp.create({
    email,
    otp: hashedOTP,
    expiresAt: Date.now() + 3 * 60 * 1000 // 3 minutes (consistent with email)
  });
  
  return otp;
};

// Password validation helper
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 6) errors.push("6 characters minimum");
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
  if (!/\d/.test(password)) errors.push("one number");
  if (!/[@$!%*?&]/.test(password)) errors.push("one special character (@$!%*?&)");
  
  return {
    isValid: errors.length === 0,
    message: errors.length > 0 
      ? "Password must contain: " + errors.join(", ") 
      : "Password is valid"
  };
};

// User registration
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Validate input fields
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists with this email" 
      });
    }

    // Create user without verification
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: "user",
      isVerified: false,
    });

    // Generate and send OTP
    const otp = await generateOTP(email);
    
    const mailOptions = {
      from: `VV Motors <${process.env.MAIL_USER || process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address - OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Welcome to Vignesh Vishnu Motors!</h2>
          <p>Hello <strong>${firstName}</strong>,</p>
          <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Your verification code is:</p>
            <h1 style="color: #007bff; font-size: 36px; margin: 10px 0; letter-spacing: 3px;">${otp}</h1>
            <p style="margin: 0; color: #666; font-size: 14px;">This code will expire in 3 minutes</p>
          </div>
          <p>If you didn't create this account, please ignore this email.</p>
          <p>Best regards,<br/>The VV Motors Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for the OTP to verify your account.",
      userId: user._id,
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Registration failed. Please try again." 
    });
  }
};

// Email verification with OTP - FIXED: Added proper error handling and logging
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Find the latest OTP for the email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false,
        message: "No OTP found for this email. Please request a new one." 
      });
    }

    // Check expiration
    if (otpRecord.expiresAt < Date.now()) {
      // Clean up expired OTP
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired. Please request a new one." 
      });
    }

    // Compare OTP values - FIXED: Added detailed logging for debugging
    console.log(`Comparing OTP: provided=${otp}, storedHash=${otpRecord.otp.substring(0, 20)}...`);
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    console.log(`OTP match result: ${isMatch}`);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP. Please try again." 
      });
    }

    // Find and update user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ 
      success: true,
      message: "Email verified successfully! You can now login to your account." 
    });
  } catch (error) {
    console.error("EMAIL VERIFICATION ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Email verification failed. Please try again." 
    });
  }
};

// Resend verification email
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this email address" 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: "Email is already verified" 
      });
    }

    // Generate and send new OTP
    const otp = await generateOTP(email);
    
    const mailOptions = {
      from: `VV Motors <${process.env.MAIL_USER || process.env.EMAIL_USER}>`,
      to: email,
      subject: "Resend: Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p>Hello <strong>${user.firstName}</strong>,</p>
          <p>Here is your new verification code:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Your verification code is:</p>
            <h1 style="color: #007bff; font-size: 36px; margin: 10px 0; letter-spacing: 3px;">${otp}</h1>
            <p style="margin: 0; color: #666; font-size: 14px;">This code will expire in 3 minutes</p>
          </div>
          <p>Best regards,<br/>The VV Motors Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true,
      message: "Verification code sent successfully to your email!" 
    });
  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to resend verification code. Please try again." 
    });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Check verification status
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Account not verified. Please check your email for verification code.",
        needsVerification: true,
        email: user.email,
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    // Return success response
    res.json({
      success: true,
      message: "Login successful",
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Login failed. Please try again." 
    });
  }
};

// Password reset request - Now using OTP
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this email address" 
      });
    }

    // Generate and send OTP for password reset
    const otp = await generateOTP(email);

    // Send reset email with OTP
    const mailOptions = {
      from: `VV Motors <${process.env.MAIL_USER || process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset - Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello <strong>${user.firstName}</strong>,</p>
          <p>You requested a password reset for your VV Motors account.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Your password reset verification code is:</p>
            <h1 style="color: #dc3545; font-size: 36px; margin: 10px 0; letter-spacing: 3px;">${otp}</h1>
            <p style="margin: 0; color: #666; font-size: 14px;">This code will expire in 3 minutes</p>
          </div>
          <p>Enter this code on the password reset page to verify your identity and set a new password.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br/>The VV Motors Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Password reset verification code sent to your email",
    });
  } catch (error) {
    console.error("PASSWORD RESET REQUEST ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to process password reset request. Please try again." 
    });
  }
};

// Verify password reset OTP and update password - FIXED: Added proper error handling
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required"
      });
    }

    // Find the latest OTP for the email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false,
        message: "No OTP found for this email. Please request a new password reset." 
      });
    }

    // Check expiration
    if (otpRecord.expiresAt < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired. Please request a new password reset." 
      });
    }

    // Compare OTP values - FIXED: Added detailed logging
    console.log(`Password reset OTP comparison: provided=${otp}, storedHash=${otpRecord.otp.substring(0, 20)}...`);
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    console.log(`Password reset OTP match result: ${isMatch}`);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP. Please try again." 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ 
      success: true,
      message: "Password updated successfully! You can now login with your new password." 
    });
  } catch (error) {
    console.error("PASSWORD RESET ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to reset password. Please try again." 
    });
  }
};

// Admin dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const admins = await User.countDocuments({ role: "admin" });
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-password -resetPasswordToken");

    res.json({
      success: true,
      message: "Admin dashboard data retrieved successfully",
      data: {
        metrics: {
          totalUsers,
          verifiedUsers,
          unverifiedUsers: totalUsers - verifiedUsers,
          admins,
        },
        recentUsers,
      }
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to load admin dashboard" 
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -resetPasswordToken");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      user
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile"
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password"
    });
  }
};

// Clean expired OTPs
export const cleanExpiredOTPs = async () => {
  try {
    // Delete OTPs older than 10 minutes
    await Otp.deleteMany({ expiresAt: { $lt: Date.now() } });
    
    console.log("Expired OTPs cleaned up");
  } catch (error) {
    console.error("CLEANUP ERROR:", error);
  }
}

// Schedule OTP cleanup to run every hour
setInterval(cleanExpiredOTPs, 60 * 60 * 1000);