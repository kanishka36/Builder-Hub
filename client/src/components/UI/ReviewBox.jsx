import React from "react";
import { Star } from "lucide-react";

const ReviewBox = ({username, rating, timeAgo, comment, sellerResponse}) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white w-full mx-auto">
      <div className="flex items-center mb-4 pb-2 border-b border-gray-300">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-white mr-4">
          J
        </div>
        <div>
          <p className="font-semibold text-lg">{username}</p>
        </div>
      </div>
      <div className="flex items-center mb-2">
        {[...Array(rating)].map((_, index) => (
          <Star key={index} className="text-yellow-500" />
        ))}
        <div className="ml-2 font-semibold">{rating}</div>
        <div className="text-gray-500 ml-2">• {timeAgo}</div>
      </div>
      <div className="text-gray-700 mb-4">
        {comment}
        <span className="text-blue-500 cursor-pointer">See more</span>
      </div>

      <div className="mt-4 border-t border-gray-300 pt-4">
        <p className="font-semibold flex items-center">
          <img
            src="/images/seller-logo.png"
            alt="Seller Logo"
            className="w-6 h-6 mr-2"
          />
          Seller's Response
        </p>
        <p className="text-gray-700 text-sm mt-2">{sellerResponse}</p>
      </div>
    </div>
  );
};

export default ReviewBox;
