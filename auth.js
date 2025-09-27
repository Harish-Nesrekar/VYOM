import express from "express";
import { requestOtp, verifyOtp, loginUser, getCurrentUser } from "../controllers/authcontroller.js";

const router = express.Router();

// --- OTP-first Registration Routes ---
router.post("/request-otp", requestOtp);  // Step 1: send OTP
router.post("/verify-otp", verifyOtp);    // Step 2: verify OTP & finalize registration

// --- Login Route ---
router.post("/login", loginUser);

// --- Get Current Logged-in User ---
router.get("/me", getCurrentUser); // New route to fetch user info

export default router;
