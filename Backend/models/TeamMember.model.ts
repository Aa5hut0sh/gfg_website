import mongoose, { Document, Schema } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  batchYear: number;
  photo: {
    url: string;
    publicId: string;
  };
  linkedin?: string;
  github?: string;
  order: number;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    batchYear: {
      type: Number,
      required: true,
      min: 2022,
      max: 2035,
    },

    photo: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

teamMemberSchema.index({
  batchYear: 1,
  order: 1,
});

const TeamMember = mongoose.model<ITeamMember>(
  "TeamMember",
  teamMemberSchema,
);

export default TeamMember;