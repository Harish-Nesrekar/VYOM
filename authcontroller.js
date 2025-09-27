import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// --- Step 1: Request OTP (temporarily store user with OTP) ---
export const requestOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

    const tempUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });
    await tempUser.save();

    // Send OTP via Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"VYOM Project" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Your One-Time Password (OTP)",
      html: `
        <h3>Hello ${name},</h3>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Error in requestOtp (Gmail):", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- Step 2: Verify OTP & finalize registration ---
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "OTP verified successfully. Registration complete." });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- Login ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- Get Current Logged-in User ---
export const getCurrentUser = async (req, res) => {
  try {
    // req.user should be populated by auth middleware from JWT
    const userId = req.user.id;
    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
