import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, removeCartItem } from "../../redux/user/cartSlice";
import { Heart, Trash2 } from "lucide-react";
import axios from "axios";
import Card from "../../components/UI/Card";
import ActionButton from "../../components/Button/ActionButton";
import { handlePayment } from "../../utils/paymentUtils";

const CCart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [selectedItem, setSelectedItem] = useState(null);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  // Handle Remove Item
  const handleRemoveItem = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_ROUTE_URL;
      await axios.delete(`${apiUrl}/api/remove/${id}`, {
        withCredentials: true,
      });
      dispatch(removeCartItem(id));
      if (selectedItem && selectedItem.productId._id === id) {
        setSelectedItem(null); // Deselect if the removed item was selected
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCheckout = () => {
    console.log(selectedItem, "selected item");
    handlePayment({
      type: "product",
      itemTitle: selectedItem.productId.name,
      amount: selectedItem.productId.price * selectedItem.quantity,
      customer: currentUser,
      sellerId: selectedItem.productId.seller._id,
      onSuccess: (orderId) => {
        console.log("Product payment success!", orderId);
        // Save product order logi here
      },
      onError: (err) => {
        console.log("Product payment failed!", err);
      },
    });
  };

  return (
    <div className="container flex gap-3">
      {/* Left Side - Cart Items */}
      <Card className="flex-2 h-screen mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.productId._id}
              onClick={() => handleSelectItem(item)}
              className={`border border-gray-300 rounded-lg p-3 mb-3 flex items-start ${
                selectedItem?.productId._id === item.productId._id
                  ? "bg-gray-100"
                  : ""
              }`}
            >
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
                <div className="text-sm font-medium">{item.productId.name}</div>

                <div className="flex justify-between items-center mt-4">
                  {/* Seller */}
                  <div>
                    <div className="text-orange-500 font-medium">
                      {item.seller}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="text-orange-500 font-medium">
                      Rs. {item.priceAtTime}
                    </div>
                  </div>

                  {/* Actions */}
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
          ))
        )}
      </Card>

      {/* Right Side - Selected Item Details */}
      <Card className="flex-1 flex flex-col justify-between items-center h-106 p-4">
        <div className="w-full flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Selected Item</h2>

          {selectedItem ? (
            <div className="w-full p-4">
              <h3 className="text-xl font-medium">
                {selectedItem.productId.name}
              </h3>
              <p className="text-lg text-gray-500">
                Unit Price: Rs. {selectedItem.priceAtTime}
              </p>
              <p className="text-lg text-gray-500">
                Qty: {selectedItem.quantity}
              </p>
              <p className="text-lg text-gray-500">
                Total Price: {selectedItem.quantity * selectedItem.priceAtTime}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500">No item selected.</p>
          )}
        </div>

        <div className="mt-4">
          <ActionButton
            onClick={handleCheckout}
            name={"Proceed to Checkout"}
            disabled={!selectedItem}
          />
        </div>
      </Card>
    </div>
  );
};

export default CCart;
