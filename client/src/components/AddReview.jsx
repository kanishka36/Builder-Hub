import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Star } from "lucide-react";
import SubmitButton from "./Button/SubmitButton";
import TextArea from "./Form/TextArea";
import Card from "./UI/Card";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";

const AddReview = ({ onClose, jobId, reviewType, orderType }) => {
  const [rating, setRating] = useState(0);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const { currentUser } = useSelector((state) => state.user);

  const userId = currentUser?._id;

  const validationSchema = Yup.object().shape({
    review: Yup.string()
      .min(10, "Review must be at least 10 characters")
      .required("Review is required"),
    rating: Yup.number()
      .min(1, "Rating is required") 
      .required("Rating is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const reviewData = {
      jobId: jobId.serviceId, 
      orderId: jobId.bookingId,
      review: values.review,
      rating: values.rating,
      userId: userId,
      reviewType: reviewType,
      orderType: orderType,
    };

    try {
      await axios.post(`${apiUrl}/api/add-reviews`, reviewData, {
        withCredentials: true,
      });

      console.log(reviewData)

      toast.success("Review Submitted Successfully", {
        position: "top-center",
        autoClose: 1500,
      });

      resetForm();
      setRating(0);
      onClose(); 
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  return (
    <Card className="p-6 w-96">
      <h2 className="text-xl font-normal mb-4 text-center">Add a Review</h2>

      <Formik
        initialValues={{ review: "", rating: 0 }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    size={30}
                    className={`cursor-pointer transition ${
                      num <= values.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                    onClick={() => {
                      setRating(num);
                      setFieldValue("rating", num);
                    }}
                  />
                ))}
              </div>
              <ErrorMessage name="rating" component="div" className="text-red-500 text-sm" />
            </div>

            <TextArea name="review" />
  
            <div className="flex justify-center">
              <SubmitButton
                disabled={isSubmitting}
                name={isSubmitting ? "Submitting..." : "Submit Review"}
              />
            </div>
          </Form>
        )}
      </Formik>

      <button
        onClick={onClose}
        className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
      >
        Cancel
      </button>
    </Card>
  );
};

export default AddReview;
