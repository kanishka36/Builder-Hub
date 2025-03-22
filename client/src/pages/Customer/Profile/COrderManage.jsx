import React, { useEffect, useState } from "react";
import Card from "../../../components/UI/Card";
import Table from "../../../components/UI/Table";
import axios from "axios";
import { useSelector } from "react-redux";
import ActionButton from "../../../components/Button/ActionButton";
import { toast } from "react-toastify";
import AddReview from "../../../components/AddReview";
import COrderDetails from "./COrderDetails";

const COrderManage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-orders/user`, {
        withCredentials: true,
      });
      setOrders(res.data.data);
    } catch (error) {
      console.log("Failed to fetch orderss:", error);
    }
  };

  console.log(orders, "orders");

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePassData = (order) => {
    setSelectedOrder(order);
  };

  const columns = [
    { header: "ID", accessor: "orderId" },
    {
      header: "Placed On",
      render: (row) => (
        <div>{new Date(row.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      header: "Item",
      render: (row) => {
        const item = row.items?.[0]; // Only one item per order (as per your setup)
        const imageUrl = item?.productId?.imageUrl?.[0];
        return (
          <div className="w-16 h-16">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item?.productId?.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                No Image
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Total",
      render: (row) => <div>{row.totalPrice} LKR</div>,
    },
    {
      header: "Total",
      render: (row) => (
        <div>
          <ActionButton name={"Manage"} onClick={() => handlePassData(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      {selectedOrder !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
      )}
      <h1 className="text-2xl font-medium text-gray-800 mb-6">My Orderss</h1>
      <div>
        <Table columns={columns} data={orders} />
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
            <COrderDetails
              order={selectedOrder}
              onClose={() => {
                setSelectedOrder(null);
                fetchOrders();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default COrderManage;
