import React, { useState, useRef, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import Slider from "react-slick";
import ActionButton from "../../components/Button/ActionButton";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "../../redux/user/cartSlice";
import { handlePayment } from "../../utils/paymentUtils";
import Card from "../../components/UI/Card";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const { state } = useLocation();
  const product = state?.product;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const mainSliderRef = useRef(null);
  const thumbnailSliderRef = useRef(null);

  const images = [
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
  ]; //should be minimum tree image

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    try {
      const receivedValues = { productId: product._id, quantity: quantity };
      await axios.post(`${apiUrl}/api/add-cart`, receivedValues, {
        withCredentials: true,
      });
      toast.success("Product Added to Cart", {
        position: "top-center",
        autoClose: 1500,
      });
      dispatch(fetchCartItems());
    } catch (error) {
      console.log("Failed to add to cart:", error);
      toast.error("Failed to add to Cart", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  //payment
  const handleCheckout = async () => {
    handlePayment({
      type: "product",
      itemTitle: product.name,
      amount: product.price * quantity,
      customer: currentUser,
      sellerId: product.seller._id,
      onSuccess: async (orderId) => {
        console.log("Product payment success!", orderId);
        try {
          const res = await axios.post(
            `${apiUrl}/api/add-order/buy-now`,
            { productId: product, quantity: quantity },
            { withCredentials: true }
          );
          if (res.data.success === true) {
            toast.success("Order confirmed!", {
              position: "top-center",
              autoClose: 1500,
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Order failed to update after payment.", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      },
      onDismiss: () => {
        toast.error("Payment was cancelled.", {
          position: "top-center",
          autoClose: 1500,
        });
      },
      onError: (err) => {
        toast.error("Payment failed. Try again.", {
          position: "top-center",
          autoClose: 1500,
        });
      },
    });
  };

  // Settings for the main slider
  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    afterChange: (current) => {
      thumbnailSliderRef.current.slickGoTo(current);
    },
  };

  // Settings for the thumbnail slider
  const thumbnailSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <Card className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Product Images with react-slick */}
        <div className="w-full md:w-2/5">
          <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
            <Slider ref={mainSliderRef} {...mainSettings}>
              {product?.imageUrl.map((img, idx) => (
                <div key={idx} className="outline-none">
                  <img
                    src={img}
                    alt={`JBL Air R03 TWS Wireless Earbuds view ${idx + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Thumbnail Slider */}
          <div className="mt-4">
            <Slider
              ref={thumbnailSliderRef}
              {...thumbnailSettings}
              asNavFor={mainSliderRef.current}
              onInit={() => {
                setTimeout(() => {
                  if (thumbnailSliderRef.current) {
                    thumbnailSliderRef.current.slickGoTo(0);
                  }
                }, 0);
              }}
            >
              {images.map((img, idx) => (
                <div key={idx} className="px-1 outline-none">
                  <div
                    className="border h-16 cursor-pointer mx-1"
                    onClick={() => mainSliderRef.current.slickGoTo(idx)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Right side - Product Details */}
        <div className="w-full md:w-3/5">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-medium text-gray-800">
              {product?.name}
            </h1>
          </div>

          {/* Ratings */}
          <div className="mt-2 flex items-center">
            <div className="flex text-yellow-400">{"★★★★★"}</div>
            <span className="ml-2 text-sm text-blue-600">Ratings 35</span>
          </div>

          {/* Descripton */}
          <div className="mt-4 text-sm">
            <span className="text-gray-600">Descripton: </span>
            <span className="mx-2">{product?.description}</span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-medium text-gray-900">
                Rs. {product?.price}
              </span>
            </div>
          </div>

          {/* Available Quantity */}
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Available Quantity:</span>
              <div className=" text-black px-2 text-sm flex items-center">
                {product?.quantity}
              </div>
            </div>
          </div>

          {/* Seller */}
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Seller:</span>
              <div className=" text-black px-2 text-sm flex items-center">
                {product.seller?.username}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Quantity:</span>
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1 border-r"
                  onClick={decreaseQuantity}
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 border-l"
                  onClick={increaseQuantity}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <ActionButton onClick={handleCheckout} name={"Buy Now"} />
            <ActionButton onClick={handleAddToCart} name={"Add to Cart"} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductPage;
