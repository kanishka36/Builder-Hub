import React, { useEffect, useState } from "react";
import Table from "../../../components/UI/Table";
import ActionButton from "../../../components/Button/ActionButton";
import EditButton from "../../../components/Button/EditButton";
import DeleteButton from "../../../components/Button/DeleteButton";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-orders/seller`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setOrders(data);
    } catch (error) {
      console.log("failed to fetch orders of seller", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      header: "Product Name",
      render: (row) => (
        <div>
          {row.items?.[0]?.productId?.name || "N/A"}
        </div>
      ),
    },
    {
      header: "Quantity",
      render: (row) => (
        <div>{row.items?.[0]?.quantity}</div>
      ),
    },
    {
      header: "Total Price",
      render: (row) => (
        <div>${row.totalPrice.toFixed(2)}</div>
      ),
    },
    {
      header: "Order Status",
      render: (row) => (
        <div>{row.orderStatus}</div>
      ),
    },
    {
      header: "Payment Status",
      render: (row) => (
        <div>{row.paymentStatus}</div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center space-x-4">
          <EditButton />
          <DeleteButton />
        </div>
      ),
    },
  ];
  
  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Order Management</h2>
      <div className="">
        <div className="flex justify-end mb-6">
          <ActionButton name={"+ Add New Service"} />
        </div>
        <Table columns={columns} data={orders} />
      </div>
    </div>
  );
};

export default Orders;
