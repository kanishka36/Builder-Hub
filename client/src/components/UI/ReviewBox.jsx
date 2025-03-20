import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const ReviewBox = ({ serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchReview = async () => {
    if (!serviceId) return;
    try {
      const res = await axios.get(`${apiUrl}/api/view-review/${serviceId}`, {
        withCredentials: true,
      });
      setReviews(res.data.data);
    } catch (error) {
      console.log("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [serviceId]);

  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const ratingAverage = calculateAverageRating(reviews);

  return (
    <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white w-full mx-auto">
      <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>

      <div className="flex items-center mb-4 pb-2 border-b border-gray-300">
        <div className="text-xl font-semibold">⭐ {ratingAverage} / 5</div>
        <span className="ml-2 text-gray-500">({reviews.length} reviews)</span>
      </div>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className="mb-4 pb-4 border rounded-md p-3 border-gray-300"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-white mr-4 overflow-hidden">
                {(
                  <img
                    src={review.userId?.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) ||
                  review.userId?.username?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {review.userId?.username}
                </p>
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500" />
                  ))}
                  <span className="ml-2 text-gray-600">{review.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.review}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet for this service.</p>
      )}
    </div>
  );
};

export default ReviewBox;
