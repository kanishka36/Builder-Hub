import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Bookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const sellerId = currentUser?._id;

  const fetchBookings = async () => {
    if (!sellerId) return; // Ensure user is available
    try {
      const res = await axios.get(`${apiUrl}/api/view-bookings/${sellerId}`, {
        withCredentials: true,
      });
      const data = res.data.data;

      setBookings(data);
      if (data.length > 0) {
        setSelectedBooking(data[0]); // Set the first booking as default selection
      }
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]); 

  console.log(bookings, "booking");

  return (
    <div>
      <div className="flex bg-gray-100 p-4">
        {/* Menu */}
        <div className="w-1/5 bg-white p-4 shadow-md rounded-lg">
          <div className="border p-2 rounded-lg border-gray-300">All Bookings</div>
          <div className="border p-2 rounded-lg border-gray-300 mt-3">Upcoming Bookings</div>
          <div className="border p-2 rounded-lg border-gray-300 mt-3">Completed Bookings</div>
          <div className="border p-2 rounded-lg border-gray-300 mt-3">Cancelled Bookings</div>
        </div>

        {/* Left Panel: Booking List */}
        <div className="w-2/5 bg-white p-4 rounded-lg shadow-md ml-4">
          <h2 className="text-lg font-semibold mb-4">All Bookings</h2>
          <ul>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <li
                  key={booking._id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer border ${
                    selectedBooking && selectedBooking._id === booking._id
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{booking.customer?.username || "Unknown User"}</span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        booking.status === "Confirmed"
                          ? "bg-blue-200 text-blue-700"
                          : booking.status === "In Progress"
                          ? "bg-yellow-200 text-yellow-700"
                          : booking.status === "Canceled"
                          ? "bg-red-200 text-red-700"
                          : "bg-green-200 text-green-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{booking.service.title || "Unknown Service"}</p>
                  <p className="text-xs text-gray-500">
                    📅 {new Date(booking.date).toISOString().split("T")[0]}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No bookings found.</p>
            )}
          </ul>
        </div>

        {/* Right Panel: Booking Details */}
        <div className="w-2/5 bg-white p-6 ml-4 rounded-lg shadow-md">
          {selectedBooking ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="mb-4">
                <h3 className="font-semibold">Customer Details</h3>
                <p>{selectedBooking.customer?.username || "Unknown User"}</p>
                <p className="text-sm text-gray-500">📧 {selectedBooking.customer?.email || "N/A"}</p>
                <p className="text-sm text-gray-500">📞 {selectedBooking.customer?.phoneNumber || "N/A"}</p>
                <p className="text-sm text-gray-500">📍 {selectedBooking.customer?.address || "N/A"}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Service Details</h3>
                <p><strong>Title:</strong> {selectedBooking.service.title || "Unknown Service"}</p>
                <p><strong>Description:</strong> {selectedBooking.service.description || "No Description"}</p>
                <p><strong>Price:</strong> {selectedBooking.service.price || "No price"}</p>
                <p className="text-sm text-gray-500">
                  📅 {new Date(selectedBooking.date).toISOString().split("T")[0]}
                </p>
                {selectedBooking.paid && (
                  <span className="text-green-600 font-bold">💲 Paid</span>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-gray-600">
                  {selectedBooking.notes || "No additional notes"}
                </p>
              </div>

              <div className="flex space-x-3 mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Completed Booking
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Cancel Booking
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a booking to view details.</p>
          )}
        </div>  
      </div>
    </div>
  );
};

export default Bookings;
