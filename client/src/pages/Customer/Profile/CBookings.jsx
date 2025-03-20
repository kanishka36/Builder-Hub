import React, { useEffect, useState } from "react";
import Card from "../../../components/UI/Card";
import Table from "../../../components/UI/Table";
import axios from "axios";
import { useSelector } from "react-redux";
import ActionButton from "../../../components/Button/ActionButton";
import { toast } from "react-toastify";
import AddReview from "../../../components/AddReview";

const CBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [booking, setBooking] = useState([]);
  const [review, setReview] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const userId = currentUser?._id;

  const handleCancel = async (id, row) => {
    const jobStatus = { jobStatus: "Cancelled" };

    const isFutureBooking = row.date.some((d) => new Date(d) > new Date());

    if (!isFutureBooking) {
      toast.error("Cannot cancel past bookings!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    try {
      await axios.put(
        `${apiUrl}/api/update-jobstatus/${id}`,
        jobStatus,
        { withCredentials: true }
      );
      toast.success("Job Cancelled Successfully", {
        position: "top-center",
        autoClose: 1500,
      });

      fetchBooking();
    } catch (error) {
      console.error("Job Cancelation failed:", error);
      toast.error("Job Cancelation failed!", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const handleConform = async (id, row) => {
    if (row.jobStatus !== "Completed") {
      toast.error("You can only confirm jobs that are completed!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    const userStatus = { userStatus: "Conformed" };

    try {
      const res = await axios.put(
        `${apiUrl}/api/update-userstatus/${id}`,
        userStatus,
        { withCredentials: true }
      );
      toast.success("Job Cancelled Successfully", {
        position: "top-center",
        autoClose: 1500,
      });

      fetchBooking();
    } catch (error) {
      console.error("Job Cancelation failed:", error);
      toast.error("Job Cancelation failed!", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const fetchBooking = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/view-user-bookings/${userId}`,
        {
          withCredentials: true,
        }
      );
      setBooking(res.data.data);
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    }
  };
  
  const fetchReviewedBookings = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/view-user-review/${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res)
      setReview(res.data.data);
    } catch (error) {
      console.log("Failed to fetch bookings:", error);
    }
  }

  console.log(review, "reviews")
  console.log(booking, "booking")

  useEffect(() => {
    fetchBooking();
    fetchReviewedBookings();
  }, []);
  

  const columns = [
    { header: "ID", accessor: "_id" },
    {
      header: "Service",
      render: (row) => <div>{row.service.title}</div>,
    },
    {
      header: "Seller",
      render: (row) => <div>{row.seller.username}</div>,
    },
    {
      header: "Dates",
      render: (row) => (
        <div>
          {row.date.map((d, index) => (
            <div key={index}>{new Date(d).toISOString().split("T")[0]}</div>
          ))}
        </div>
      ),
    },
    {
      header: "Price",
      render: (row) => <div>{row.service.price * row.date.length}</div>,
    },
    { header: "Job Status", accessor: "jobStatus" },
    {
      header: "Action",
      render: (row) => {
        const isFutureBooking = row.date.some((d) => new Date(d) > new Date());
        const isJobCompleted = row.jobStatus === "Completed";
        const isJobCancelled = row.jobStatus === "Cancelled";
        const isUserConformed = row.userStatus === "Conformed";
        const isAlreadyReviewed = review?.some(
          (rev) => rev.orderId === row._id && rev.jobId === row.service._id
        );
    
        return (
          <div className="flex items-center space-x-4">
            {/* Display "Cancelled" if job is cancelled */}
            {isJobCancelled ? (
              <span className="text-red-500 font-semibold">Cancelled</span>
            ) : isJobCompleted ? null : ( // Remove "Cancel" button if job is completed
              isFutureBooking && (
                <ActionButton
                  name={"Cancel"}
                  onClick={() => handleCancel(row._id, row)}
                />
              )
            )}
    
            {/* Display "Conformed" if user is already conformed */}
            {isUserConformed ? (
              <span className="text-green-500 font-semibold">Conformed</span>
            ) : (
              isJobCompleted && (
                <ActionButton
                  name={"Conformed"}
                  onClick={() => handleConform(row._id, row)}
                />
              )
            )}

              {!isFutureBooking && !isJobCancelled && !isAlreadyReviewed && (
                <ActionButton
                  name={"Add Review"}
                  onClick={() => setSelectedBooking({serviceId: row.service._id, bookingId: row._id})}
                />
              )}
          </div>
        );
      },
    }
    
  ];

  return (
    <div className="relative">
      {selectedBooking !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" ></div>
      )}
      <h1 className="text-2xl font-medium text-gray-800 mb-6">My Bookings</h1>
      <div>
        <Table columns={columns} data={booking} />
      </div>
      {selectedBooking && (
        <div className="absolute top-0 left-[25%] z-50">
          <AddReview
            jobId={selectedBooking}
            reviewType={"Service"}
            orderType={"Booking"}
            onClose={() => {
              setSelectedBooking(null);
              fetchReviewedBookings(); // ✅ Fetch updated reviews when closing
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CBookings;
