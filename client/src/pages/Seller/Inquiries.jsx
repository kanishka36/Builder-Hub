import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat";
import { useSelector } from "react-redux";
import axios from "axios";

const Inquiries = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [customerId, setCustomerId] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const sellerId = currentUser?._id;

  const fetchBookings = async () => {
    if (!sellerId) return; // Ensure user is available
    try {
      const res = await axios.get(`${apiUrl}/api/view-bookings/${sellerId}`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setCustomerId(data);
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    }
  };

  console.log(customerId, "customerId")

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);
  return (
    <div>
      <Chat userId={sellerId} receiverId={customerId} />
    </div>
  );
};

export default Inquiries;
