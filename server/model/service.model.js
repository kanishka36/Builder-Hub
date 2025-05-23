import mongoose from "mongoose";
import { Booking } from "./booking.model.js";
import { Review } from "./review.model.js";

const serviceManageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

// Cascade delete bookings when a user is deleted
serviceManageSchema.pre("findOneAndDelete", async function (next) {
  try {
    const service = await this.model.findOne(this.getFilter());
    if (service) {
      await Booking.deleteMany({ service: service._id });
      await Review.deleteMany({jobId: service._id, reviewType: "Service"})
    }
    next();
  } catch (error) {
    next(error);
  }
});


export const Service = mongoose.model("Service", serviceManageSchema);
