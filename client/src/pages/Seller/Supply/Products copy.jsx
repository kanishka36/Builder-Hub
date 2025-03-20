import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import Card from "../../../components/UI/Card";
import { Star } from "lucide-react";
import LoadingPage from "../../../components/UI/LoadingPage";
import EditButton from "../../../components/Button/EditButton";
import DeleteButton from "../../../components/Button/DeleteButton";

const ProductCard = ({ product, handleDelete }) => {
  const [reviews, setReviews] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) return;

      try {
        const response = await axios.get(`${apiUrl}/api/view-review/${product._id}`, {
          withCredentials: true,
        });
        setReviews(response.data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [product?._id, apiUrl]);

  const calculateAverageRating = () => {
    if (!reviews.length) return "0.0";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const rating = calculateAverageRating();
  const reviewCount = reviews.length;

  return (
    <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="w-full h-44 bg-gray-200 flex items-center justify-center">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product?.name || "Product Image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">No Image Available</span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">{product?.name || "Unnamed Product"}</h2>
        <p className="text-sm text-gray-600">{product?.description || "No description available."}</p>

        {/* Price & Quantity */}
        <p className="text-sm text-gray-800 font-medium mt-1">
          <span className="text-gray-600">Price:</span> ${product?.price || "0.00"}
        </p>
        <p className="text-sm text-gray-800 font-medium">
          <span className="text-gray-600">Quantity:</span> {product?.quantity || "0"}
        </p>

        {/* Ratings & Reviews */}
        <div className="flex items-center mt-3">
          <Star className="text-yellow-500 w-4 h-4" />
          <span className="ml-1 font-semibold">{rating}</span>
          <span className="text-gray-500 ml-2">({reviewCount} Reviews)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <EditButton onClick={() => navigate(`/edit-product/${product?._id}`)} />
          <DeleteButton onClick={() => handleDelete(product?._id)} />
        </div>
      </div>
    </Card>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const { currentUser } = useSelector((state) => state.user);

  const sellerId = currentUser._id;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-products/${sellerId}`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setProducts(data);
    } catch (error) {
      console.log("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/delete-service/${id}`, {
        withCredentials: true,
      });
      toast.success("Service deleted successfully", {
        position: "top-center",
        autoClose: 1500,
      });
      fetchService();
    } catch (error) {
      toast.error("Failed to delete service. Please try again.");
      console.log("Failed to delete service:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
