import mongoose from "mongoose";


const codingProfilesSchema = new mongoose.Schema({
  leetcode: {
    username: { type: String },
    solved: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    ranking: { type: Number },
    lastUpdated: { type: Date }
  },

  codeforces: {
    username: { type: String },
    rating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    rank: { type: String, default: "Unrated" },
    maxRank: { type: String },
    contests: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    lastUpdated: { type: Date }
  },

  github: {
    username: { type: String },
    repos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    contributions: { type: Number, default: 0 },
    lastUpdated: { type: Date }
  }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      default: null,
    },

    hashedPassword: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    codingProfiles: codingProfilesSchema,

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  },
);



const User = mongoose.model("User", userSchema);

export default User;
