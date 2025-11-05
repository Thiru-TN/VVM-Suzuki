import express from "express";
import { submitTestRideBooking } from "../controllers/testRideController.js";
import { protect } from "../middleware/auth.js"; 

const router = express.Router();

// Apply the protect middleware here
router.post("/", protect, submitTestRideBooking); 

export default router;