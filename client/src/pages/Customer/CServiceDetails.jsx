import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import ReviewBox from "../../components/UI/ReviewBox";
import Calendar from "react-calendar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Chat from "../../components/Chat";
import { handlePayment } from "../../utils/paymentUtils";

const CServiceDetails = () => {
  const [service, setService] = useState({});
  const { serviceId } = useParams();
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]); // Store selected date range
  const [sellerId, setSellerId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const customerId = currentUser?._id;
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/view-service/${serviceId}`);
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
    handlePayment({
      type: "booking",
      itemTitle: service.title,
      amount: service.price * selectedDates.length,
      customer: currentUser,
      sellerId,
      onSuccess: async (orderId) => {
        try {
          const res = await axios.post(
            `${apiUrl}/api/book`,
            {
              sellerId,
              customerId: currentUser._id,
              serviceId,
              date: selectedDates,
              transactionId: orderId,
            },
            { withCredentials: true }
          );

          if (res.data.success) {
            toast.success("Booking confirmed!", {
              position: "top-center",
              autoClose: 1500,
            });
            setBookedDates([...bookedDates, ...selectedDates]);
            setSelectedDates([]);
          }
        } catch (error) {
          toast.error("Booking failed to update after payment.", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      },
      onDismiss: () => {
        toast.error("Payment was cancelled.", {
          position: "top-center",
          autoClose: 1500,
        });
      },
      onError: (err) => {
        toast.error("Payment failed. Try again.", {
          position: "top-center",
          autoClose: 1500,
        });
      },
    });
  };

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

  const handleToggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <div className="container mx-auto p-6 flex gap-8">
      <div className="flex-3">
        <div className="text-2xl font-bold">{service.title}</div>
        <Card className="flex items-center mt-3">
          <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden mr-3">
            {service.seller?.imageUrl ? (
              <img
                src={service.seller?.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500 flex items-center justify-center h-full">
                No Image
              </span>
            )}
          </div>
          <div>
            <div className="font-semibold">{service.seller?.username}</div>
            <div className="text-sm text-gray-500">4 orders in queue</div>
          </div>
        </Card>
        <Card className="mt-6">
          <div className="font-semibold mt-2">Description</div>
          <div className="text-gray-700 text-sm mt-1">
            {service?.description}
          </div>
          <div className="font-semibold mt-2">Price</div>
          <div className="text-gray-700 text-sm mt-1">
            {service?.price
              ? `LKR ${service.price} per day`
              : "Price not available"}
          </div>
        </Card>
        <Card className="mt-6">
          <div className="text-lg font-bold mb-4">Reviews</div>
          <ReviewBox serviceId={serviceId} />
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
            <div className="mb-1">
              <button
                className="w-full mt-2 bg-primary text-black py-2 rounded-lg hover:bg-green-600"
                onClick={handleBookDate}
              >
                Book Now
              </button>
            </div>
            <div>
              <button
                onClick={handleToggleChat}
                className="w-full mt-2 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Contact Me
              </button>
            </div>
          </Card>
        </div>
      </div>
      {/* Chat Box (Visible When Contact Me Clicked) */}
      {showChat && (
        <div className="fixed bottom-5 right-5 w-[350px] bg-white shadow-lg rounded-lg">
          {/* Chat Component */}
          <Chat
            userId={customerId}
            receiverId={sellerId}
            onClose={handleToggleChat}
            receiverName={service.seller?.username}
          />
        </div>
      )}
    </div>
  );
};

export default CServiceDetails;
