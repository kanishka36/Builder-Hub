import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    date: {
      type: [Date],
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "Conformed",
    },
    jobStatus: {
      type: String,
      required: true,
      default: "Pending",
    },
    userStatus: {
      type: String,
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
