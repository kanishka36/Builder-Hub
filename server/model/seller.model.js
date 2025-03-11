import mongoose from "mongoose";

// Define the Seller Schema
const sellerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (value) {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      //       value
      //     );
      //   },
      //   message:
      //     "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      // },
    },
    category: {
      type: String,
      required: true,
      enum: ["supplier", "service-provider"],
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    imageUrl: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    fcmToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Seller = mongoose.model("Seller", sellerSchema);
