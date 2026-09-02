import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  //mail
  email: {
    type: String,
    required: true,
  },
  
  // encypted otp
  codeHash: {
    type: String,
    required: true,
  },
  
  // purpose
  purpose: {
    type: String,
    enum: ['SIGNUP', 'RESET'],
    required: true,
  },
  
  // attempts
  attempts: {
    type: Number,
    default: 0,
  },
  
  // time limit
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600, 
  }
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;