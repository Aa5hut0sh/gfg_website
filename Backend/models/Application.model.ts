import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rollNo: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^[0-9]{2}[a-z]{2}[0-9]{4}$/,
        "Invalid roll number format (eg: 25cs3013)",
      ],
    },
    MobileNo: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Invalid mobile number format (eg: 9876543210)"],
    },

    preference1: {
      type: String,
      required: true,
      enum: ["Technical Team", "Design Team" , "Dev Team" , "E-sports Team" , "Logistic Team" , "VideoEditing Team" , "PR-Outreach Team" , "SocialMedia Team" , "Editorial Team"],
    },

    preference2: {
      type: String,
      enum: ["Technical Team", "Design Team" , "Dev Team" , "E-sports Team" , "Logistic Team" , "VideoEditing Team" , "PR-Outreach Team" , "SocialMedia Team" , "Editorial Team"],
    },

    preference3: {
      type: String,
      enum: ["Technical Team", "Design Team" , "Dev Team" , "E-sports Team" , "Logistic Team" , "VideoEditing Team" , "PR-Outreach Team" , "SocialMedia Team" , "Editorial Team"],
    },

    skills: [
      {
        type: String,
      },
    ],

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },

    OtherClubs: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({ user: 1 });
applicationSchema.index({ rollNo: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
