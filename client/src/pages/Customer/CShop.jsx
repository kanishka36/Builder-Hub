import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Star } from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingPage from "../../components/UI/LoadingPage";

const ProductCard = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchReview = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-review/${product._id}`, {
        withCredentials: true,
      });
      setReviews(res.data.data || []);
    } catch (error) {
      console.log("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    if (product?._id) {
      fetchReview();
    }
  }, [product?._id]);

  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const rating = calculateAverageRating(reviews);
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
        
      </div>
    </Card>
  );
};

const CShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const { supplierId } = useParams();

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-products/${supplierId}`, {
        withCredentials: true,
      });
      setProducts(res.data.data);
    } catch (error) {
      console.log("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(products)

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product._id} to={`/product/${product._id}`} state={{product}}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CShop;
