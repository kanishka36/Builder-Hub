import mongoose from "mongoose";
import {Booking} from "./booking.model.js"

// Define the User Schema
const userSchema = new mongoose.Schema(
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
    phoneNumber: {
      type: Number,
      unique: true,
    },
    address: {
      type: String,
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
    role: {
      type: String,
      required: true,
      default: "user",
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

// Cascade delete bookings when a user is deleted.
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      await Booking.deleteMany({ customer: user._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.model("User", userSchema);
