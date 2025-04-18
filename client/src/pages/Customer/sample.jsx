import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import ReviewBox from "../../components/UI/ReviewBox";
import Calendar from "react-calendar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CServiceDetails = () => {
  const review = {
    username: "Johnolszew",
    country: "Canada",
    rating: 5,
    timeAgo: "1 week ago",
    comment:
      "Like most people, I was initially skeptical since this was my first Fiverr experience. However, after working with Luna, I am now fully confident in the platform. I had no clear idea of what I wanted for our company logo, but she came up with an incredibly creative design. It turned out simpler than...",
    price: "$50",
    duration: "2 days",
    sellerResponse:
      "Thank you for your kind words! It was a pleasure working on your project.",
  };

  const [service, setService] = useState({});
  const { serviceId } = useParams();
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]); // Store selected date range
  const [sellerId, setSellerId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const customerId = currentUser?._id;
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  console.log(service);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/view-service/${serviceId}`);
        console.log(res.data.data, "service");
        setService(res.data.data);
        setSellerId(res.data.data?.seller?._id); // Set sellerId after service loads
      } catch (error) {
        console.log("Failed to fetch service:", error);
      }
    };

    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/view-bookings`, {
          withCredentials: true,
        });
        const data = res.data.data;
        const formattedDates = data
          .flatMap((booking) => booking.date)
          .map((date) => new Date(date).toISOString().split("T")[0]);

        setBookedDates(formattedDates);
      } catch (error) {
        console.log("Failed to fetch booked dates:", error);
      }
    };

    fetchService();
    fetchBookedDates();
  }, [serviceId, apiUrl]);

  // Handle multiple date selection
  const handleSelectDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];

    // Prevent selecting already booked dates
    if (bookedDates.includes(formattedDate)) {
      toast.error("This date is already booked. Please select another date.", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    // Toggle selection (add/remove date)
    setSelectedDates(
      (prevSelected) =>
        prevSelected.includes(formattedDate)
          ? prevSelected.filter((d) => d !== formattedDate) // Remove if already selected
          : [...prevSelected, formattedDate] // Add new date
    );
  };

  const handleBookDate = async () => {
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date before booking.", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    // Generate Order ID
    const orderId = `BOOKING_${Date.now()}`;

    // Define payment details
    const payment = {
      sandbox: true, // Set to false for live
      merchant_id: "1226807", // Must be a string, not a number
      return_url: "http://localhost:5173/payment-success", // Redirect after success
      cancel_url: "http://localhost:5173/payment-failed", // Redirect if canceled
      // notify_url: `${apiUrl}/api/payment-webhook`, // Webhook for backend validation
      notify_url: `http://localhost:5173/notify`, // Webhook for backend validation
      order_id: "ItemNo123452",
      items: "Pharmacy Items",
      amount: 100,
      currency: "LKR",
      first_name: "user.firstName",
      last_name: "user.lastName",
      email: "user.email",
      phone: "user.phone",
      address: "No.1, Galle Road",
      city: "Colombo",
      country: "Sri Lanka",
      delivery_address: "No. 46, Galle road, Kalutara South",
      delivery_city: "Kalutara",
      delivery_country: "Sri Lanka",
      custom_1: "",
      custom_2: "",
    };

    try {
      const response = await axios.post(`${apiUrl}/api/generate-hash`, {
        merchant_id: payment.merchant_id,
        order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
      });

      payment.hash = response.data.hash;
      payhere.startPayment(payment);
    } catch (error) {
      console.error("Error generating hash:", error);
    }
  };

  useEffect(() => {
    payhere.onCompleted = async function (orderId) {
      console.log("Payment completed. Order ID:", orderId);

      try {
        const res = await axios.post(
          `${apiUrl}/api/book`,
          {
            sellerId: sellerId,
            customerId: customerId,
            serviceId: serviceId,
            date: selectedDates,
            transactionId: orderId, // Store transaction ID
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          toast.success("Booking confirmed after payment!", {
            position: "top-center",
            autoClose: 1500,
          });

          // Update state
          setBookedDates([...bookedDates, ...selectedDates]);
          setSelectedDates([]);
        }
      } catch (error) {
        console.error("Booking update failed:", error);
        toast.error("Booking confirmation failed!", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    };

    // PayHere Payment Dismissed Callback
    payhere.onDismissed = function () {
      toast.error("Payment process was canceled.", {
        position: "top-center",
        autoClose: 1500,
      });
    };

    // PayHere Payment Error Callback
    payhere.onError = function (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.", {
        position: "top-center",
        autoClose: 1500,
      });
    };
  }, [sellerId, selectedDates]);

  const isDateBooked = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    return bookedDates.includes(formattedDate);
  };

  // Check if date is selected
  const isDateSelected = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return selectedDates.includes(formattedDate);
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of day for accurate comparison
    return date < today; // Returns true if the date is in the past
  };

  return (
    <div className="container mx-auto p-6 flex gap-8">
      <div className="flex-3">
        <div className="text-2xl font-bold">{service.title}</div>
        <Card className="flex items-center mt-3">
          <img
            src={service.seller?.imageUrl}
            alt={service.seller?.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{service.seller?.username}</div>
            <div className="text-sm text-gray-500">4 orders in queue</div>
          </div>
        </Card>
        <Card className="mt-6">
          <div className="font-semibold">Description</div>
          <div className="text-gray-700 text-sm mt-2">
            {service?.description}
          </div>
        </Card>
        <Card className="mt-6">
          <div className="flex justify-between items-center font-bold mb-3">
            <div className="text-lg ">
              What people loved about this freelancer
            </div>
            <div className="text-md">See all reviews</div>
          </div>
          <ReviewBox
            username={review.username}
            rating={review.rating}
            timeAgo={review.timeAgo}
            comment={review.comment}
            sellerResponse={review.comment}
          />
        </Card>
        <Card className="mt-6">
          <div className="text-lg font-bold mb-4">Reviews</div>
          <ReviewBox
            username={review.username}
            rating={review.rating}
            timeAgo={review.timeAgo}
            comment={review.comment}
            sellerResponse={review.comment}
          />
        </Card>
      </div>
      <div className="flex-2 relative">
        <div className="sticky top-70">
          <Card>
            <div className="text-lg font-bold mb-4">
              Schedule a Consultation
            </div>
            <div className="mb-4">
              <Calendar
                onClickDay={handleSelectDate} // Click to select multiple dates
                tileClassName={
                  ({ date }) =>
                    isPastDate(date) // Check if past date
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Gray out past dates
                      : isDateBooked(date)
                      ? "bg-red-500 text-white cursor-not-allowed" // Booked dates
                      : isDateSelected(date)
                      ? "bg-blue-400 text-white" // Selected dates
                      : "bg-green-200" // Available dates
                }
                tileDisabled={({ date }) =>
                  isPastDate(date) || isDateBooked(date)
                } // Disable past and booked dates
              />
            </div>
            <div className="mb-4">
              <button
                className="w-full mt-2 bg-primary text-black py-2 rounded-lg hover:bg-green-600"
                onClick={handleBookDate}
              >
                Book Now
              </button>
            </div>
            <div>
              <button className="w-full mt-2 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-600">
                Contact Me
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CServiceDetails;
