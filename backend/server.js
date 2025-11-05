// server.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./middleware/db.js";
import { protect, isAdmin } from "./middleware/auth.js";
import authRoutes from "./routes/authRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import testRideRoutes from "./routes/testRideRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quotation", quotationRoutes);
app.use("/api/test-ride", testRideRoutes);

// Protected test routes
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected content",
    user: req.user,
  });
});

app.get("/api/admin", protect, isAdmin, (req, res) => {
  res.json({
    message: "Admin dashboard",
    user: req.user,
  });
});

// Public routes (landing & login pages)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login", "login.html"));
});

// ✅ Protected main route
app.get("/main", protect, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main", "main.html"));
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
