import React, { useEffect, useState } from "react";
import Table from "../../../components/UI/Table";
import ActionButton from "../../../components/Button/ActionButton";
import axios from "axios";
import OrderDetails from "./OrderDetails";
import { X } from "lucide-react"; // Close icon (optional, or use any)

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-orders/seller`, {
        withCredentials: true,
      });
      setOrders(res.data.data);
    } catch (error) {
      console.log("Failed to fetch orders of seller", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePassData = (order) => {
    setSelectedOrder(order);
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  const columns = [
    {
      header: "Order ID",
      render: (row) => <div>{row.orderId || "N/A"}</div>,
    },
    {
      header: "Date",
      render: (row) => (
        <div>{new Date(row.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      header: "Product Name",
      render: (row) => <div>{row.items?.[0]?.productId?.name || "N/A"}</div>,
    },
    {
      header: "Order Status",
      render: (row) => <div>{row.orderStatus}</div>,
    },
    {
      header: "Total Price",
      render: (row) => <div>LKR {row.totalPrice.toFixed(2)}</div>,
    },
    {
      header: "Payment Status",
      render: (row) => <div>{row.paymentStatus}</div>,
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center space-x-4">
          <ActionButton name="View" onClick={() => handlePassData(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      {selectedOrder !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
      )}
      <h2 className="text-2xl font-semibold mb-6">Order Management</h2>

      <div className="mb-8">
        <Table columns={columns} data={orders} />
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
            <OrderDetails
              order={selectedOrder}
              onClose={() => {setSelectedOrder(null); fetchOrders()}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
