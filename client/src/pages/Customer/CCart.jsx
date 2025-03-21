import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, removeCartItem } from "../../redux/user/cartSlice";
import { Heart, Trash2 } from "lucide-react";
import axios from "axios";

const CCart = () => {
  const dispatch = useDispatch();
  const { cartItems, cartItemCount } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleRemoveItem = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_ROUTE_URL;
      await axios.delete(`${apiUrl}/api/remove/${id}`, {
        withCredentials: true,
      });
      dispatch(removeCartItem(id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="container">
      <div className="mx-auto w-full bg-white shadow-sm rounded-md p-2">
        <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="border-t py-3">
              <div className="flex items-start">
                <div className="flex items-center h-full pt-1">
                  <input type="checkbox" className="mr-2" />
                </div>

                {/* Product Image */}
                <div className="w-16 h-16 mr-3">
                  <img
                    src={item.productId.imageUrl || "/placeholder.png"}
                    alt={item.productId.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="text-sm font-medium line-clamp-2">
                    {item.productId.name}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {/* Price */}
                    <div>
                      <div className="text-orange-500 font-medium">
                        Rs. {item.priceAtTime}
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex gap-4 items-center">
                      <div className="text-sm text-gray-700">
                        Qty: {item.quantity}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Heart size={18} />
                        </button>
                        <button
                          className="p-2 rounded-full text-gray-400 hover:text-red-600 transition"
                          onClick={() => handleRemoveItem(item.productId._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CCart;
