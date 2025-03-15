import React, { useEffect, useState } from "react";
import Card from "../../../components/UI/Card";
import Table from "../../../components/UI/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ActionButton from "../../../components/Button/ActionButton";

const CBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [booking, setBooking] = useState([]);

  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const userId = currentUser?._id;

  const fetchBooking = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/view-user-bookings/${userId}`,
        {
          withCredentials: true,
        }
      );
      const data = res.data.data;
      console.log(data, "data");
      setBooking(data);
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const handleAction = (id) => {
    console.log(id)
  }

  const columns = [
    { header: "ID", accessor: "_id" },
    {
      header: "Service",
      render: (row) => <div className="">{row.service.title}</div>,
    },
    {
      header: "Seller",
      render: (row) => <div className="">{row.seller.username}</div>,
    },
    {
      header: "Dates",
      render: (row) => (
        <div className="">
          {row.date.map((d, index) => (
            <div key={index}>{new Date(d).toISOString().split("T")[0]}</div>
          ))}
        </div>
      ),
    },
    {
      header: "Price",
      render: (row) => (
        <div className="">{row.service.price * row.date.length}</div>
      ),
    },
    { header: "Status", accessor: "jobStatus" },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center space-x-4">
          <ActionButton name={"Action"} onClick={() => handleAction(row._id)} />
        </div>
      ),
    },
  ];
  return (
    <>
      <h1 className="text-2xl font-medium text-gray-800 mb-6">My Bookings</h1>
      <div className="">
        <Table columns={columns} data={booking} />
      </div>
    </>
  );
};

export default CBookings;
