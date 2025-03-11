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
    status: {
      type: String,
      default: "conformed"
    }
  },
  { timestamps: true }
);



export const Booking = mongoose.model("Booking", bookingSchema);
