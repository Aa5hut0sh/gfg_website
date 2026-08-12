import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    fields: [
      {
        label: { type: String, required: true },
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["text", "email", "number", "select", "checkbox", "textarea", "date"],
          required: true,
        },
        required: { type: Boolean, default: false },
        options: [String],
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deadline: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
