import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Star } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingPage from "../../components/UI/LoadingPage";
import NearbySellersMap from "../../components/NearbySellersMap";
import ActionButton from "../../components/Button/ActionButton";

const ServiceCard = ({ service }) => {
  const [reviews, setReviews] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const fetchReview = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-review/${service._id}`, {
        withCredentials: true,
      });
      setReviews(res.data.data);
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const rating = calculateAverageRating(reviews);
  const reviewCount = reviews.length;

  return (
    <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="w-full h-44 bg-gray-200 flex items-center justify-center">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">No Image Available</span>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">{service.title}</h2>
        <p className="text-sm text-gray-600">{service.seller?.username}</p>

        <div className="flex items-center mt-2">
          <Star className="text-yellow-500 w-4 h-4" />
          <span className="ml-1 font-semibold">{rating || "0.0"}</span>
          <span className="text-gray-500 ml-2">
            ({reviewCount || "0"} reviews)
          </span>
        </div>

        <p className="mt-2 text-md font-semibold text-gray-800">
          From ${service.price}
        </p>
      </div>
    </Card>
  );
};

const CServices = () => {
  const [services, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const fetchService = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-service`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setService(data);
    } catch (error) {
      console.log("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <p className="text-2xl font-thin">{`${
            toggle ? "" : "Find Your Seller Near By Your Location"
          }`}</p>
          <ActionButton
            name={`${toggle ? "Close" : "Click"}`}
            onClick={() => handleToggle()}
          />
        </div>
      </div>

      {toggle && (
        <div className="my-3">
          <NearbySellersMap />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {services.map((service) => (
          <Link key={service._id} to={`/services/${service._id}`}>
            <ServiceCard service={service} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CServices;
