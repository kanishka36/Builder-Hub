import { Review } from "../model/review.model.js";


export const addReview = async (req, res) => {
  let { review, rating, jobId, userId, reviewType, orderId, orderType} = req.body;

  try {
    if (!review || !rating || !jobId || !userId || !reviewType || !orderId || !orderType) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    await Review.create({
      review: review,
      rating: rating,
      jobId: jobId,
      userId: userId,
      reviewType: reviewType,
      orderId: orderId,
      orderType: orderType,
    });

    return res.status(201).json({
      succuss: true,
      message: "Review added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      succuss: false,
      message: "An error occurred while creating review",
      error: error.message,
    });
  }
};

// View All Reviews
export const viewReview = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username imageUrl")
      .exec();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching reviews",
      error: error.message,
    });
  }
};
// View All Reviews
export const viewUserReview = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const reviews = await Review.find({userId: userId })
      .populate("userId", "username imageUrl")
      .exec();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching reviews",
      error: error.message,
    });
  }
};