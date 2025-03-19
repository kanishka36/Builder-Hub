import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
      review: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "reviewType",
      },
      reviewType: {
        type: String,
        required: true,
        enum: ["Service", "Product"],
      },
    },
    { timestamps: true }
  );


export const Review = mongoose.model("Review", reviewSchema);