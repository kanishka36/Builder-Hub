import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["supplier","service-provider"]
    }
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
