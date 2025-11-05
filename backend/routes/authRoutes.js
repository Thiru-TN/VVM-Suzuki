//authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getAdminDashboard,
  resendVerificationEmail
} from "../controllers/authController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", resendVerificationEmail);

// Protected routes
router.get("/verify-token", protect, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user
  });
});

// Protected admin route
router.get("/admin/dashboard", protect, isAdmin, getAdminDashboard);

// User profile routes
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});


router.put("/profile", protect, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const User = (await import("../models/User.js")).default;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    ).select("-password");
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Logout route
router.post("/logout", protect, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

export default router;