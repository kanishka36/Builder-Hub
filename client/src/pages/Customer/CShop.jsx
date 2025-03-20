import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Star } from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingPage from "../../components/UI/LoadingPage";

const ProductCard = ({ supplier }) => {
  const [reviews, setReviews] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchReview = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-review/${supplier._id}`, {
        withCredentials: true,
      });
      setReviews(res.data.data);
    } catch (error) {
      console.log("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    if (supplier?._id) {
      fetchReview();
    }
  }, [supplier?._id]);

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
        {supplier.imageUrl ? (
          <img
            src={supplier.imageUrl}
            alt={supplier.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">No Image Available</span>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">
          {supplier.role?.name}
        </h2>
        <p className="text-sm text-gray-600">{supplier.seller?.username}</p>

        <div className="flex items-center mt-2">
          <Star className="text-yellow-500 w-4 h-4" />
          <span className="ml-1 font-semibold">{rating || "0.0"}</span>
          <span className="text-gray-500 ml-2">
            ({reviewCount || "0"} Reviews)
          </span>
        </div>
      </div>
    </Card>
  );
};

const CShop = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const { supplierId } = useParams();

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-products/${supplierId}`, {
        withCredentials: true,
      });
      setSuppliers(res.data.data);
    } catch (error) {
      console.log("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {suppliers.map((supplier) => (
          <Link key={supplier._id} to={`/shop/${supplier._id}`}>
            <ProductCard supplier={supplier} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CShop;
