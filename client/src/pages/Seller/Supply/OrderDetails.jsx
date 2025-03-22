import React from "react";
import Card from "../../../components/UI/Card";
import CloseButton from "../../../components/Button/CloseButton";
import { toast } from "react-toastify";
import axios from "axios";

const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <div className="flex justify-end">
          <CloseButton onClick={onClose} />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div className="space-y-1">
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p>
              <strong>Status:</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>
            <p>
              <strong>Total Quantity:</strong> {order.totalQuantity}
            </p>
            <p>
              <strong>Total Price:</strong> LKR {order.totalPrice}
            </p>
            <p>
              <strong>Placed On:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Delivered:</strong> {order.isDelivered ? "Yes" : "No"}
            </p>
          </div>

          {/* Billing Address */}
          <div className="space-y-1">
            <h4 className="text-md font-semibold mb-1">Billing Address</h4>
            <p>{order.billingAddress.fullName}</p>
            <p>{order.billingAddress.address}</p>
            <p>{order.billingAddress.city}</p>
            <p>{order.billingAddress.phone}</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">
            Update Order Status
          </label>
          <select
            value={order.orderStatus}
            onChange={async (e) => {
              const newStatus = e.target.value;
              try {
                const res = await axios.put(
                  `${apiUrl}/api/update-order-status/${order.orderId}`,
                  { status: newStatus },
                  { withCredentials: true }
                );
                if (res.data.success) {
                  toast.success("Order status updated!");
                  onClose();
                }
              } catch (err) {
                toast.error("Failed to update status");
              }
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <hr className="my-6" />

        {/* Items */}
        <h3 className="text-lg font-semibold mb-3">Ordered Items</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => {
            const product = item.productId;
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b pb-4"
              >
                <img
                  src={product.imageUrl?.[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded shadow"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-md">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="mt-1 text-sm">Price: LKR {item.priceAtTime}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-sm">
                    Sub Total: LKR {item.quantity * item.priceAtTime}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
