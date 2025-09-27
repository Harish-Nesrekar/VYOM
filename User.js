import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // --- Fields for OTP Functionality ---
  otp: {
    type: String,
    default: undefined
  },
  otpExpires: {
    type: Date,
    default: undefined
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);