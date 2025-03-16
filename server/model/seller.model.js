import mongoose from "mongoose";
import { Service } from "./service.model.js";
import { Booking } from "./booking.model.js";

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
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // Longitude first, then latitude
    },
  },
  {
    timestamps: true,
  }
);

// Create a geospatial index for location
sellerSchema.index({ location: "2dsphere" });

// Cascade delete services and bookings when a seller is deleted.
sellerSchema.pre("findOneAndDelete", async function (next) {
  try {
    const seller = await this.model.findOne(this.getFilter());
    if (seller) {
      await Booking.deleteMany({ seller: seller._id });
      await Service.deleteMany({ seller: seller._id});
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const Seller = mongoose.model("Seller", sellerSchema);
