import express from "express";
import { submitQuotation } from "../controllers/quotationController.js";
import { protect } from "../middleware/auth.js"; // import auth middleware

const router = express.Router();

// Apply protect so req.user gets filled with { id, email }
router.post("/", protect, submitQuotation);

export default router;
