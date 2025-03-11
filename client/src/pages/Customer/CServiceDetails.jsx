import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import ReviewBox from "../../components/ReviewBox";
import Calendar from "react-calendar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CServiceDetails = () => {
  const service2 = {
    title: "I will design modern minimalist luxury business logo design",
    seller: {
      name: "Luna",
      ordersInQueue: 4,
      rating: 5.0,
      reviews: 201,
      profileImage: "/images/luna-profile.png",
    },
    media: {
      video: "/videos/astrojuice.mp4",
      image: "/images/astrojuice.png",
    },
  };

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
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([])
  
  const { currentUser } = useSelector((state) => state.user);
  const customerId = currentUser._id;
  const sellerId = service.seller?._id;
  const apiUrl = import.meta.env.VITE_ROUTE_URL;


  const fetchService = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-service/${serviceId}`);
      setService(res.data.data);
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

      // Convert dates to YYYY-MM-DD format for comparison
      const formattedDates = data.map(
        (booking) => new Date(booking.date).toISOString().split("T")[0]
      );

      setBookedDates(formattedDates);
    } catch (error) {
      console.log("Failed to fetch booked dates:", error);
    }
  };

  const handleBookDate = async () => {
    const formattedDate = date.toISOString().split("T")[0];

    if (isDateBooked(date)) {
      toast.error("This date is already booked. Please select another date.", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    try {
      const res = await axios.post(
        `${apiUrl}/api/book`,
        {
          sellerId: sellerId,
          customerId: customerId,
          serviceId: serviceId,
          date: formattedDate,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Date booked successfully!", {
          position: "top-center",
          autoClose: 1500,
        });
        setBookedDates([...bookedDates, formattedDate]);
      }
    } catch (error) {
      console.log("Failed to book date:", error);
      toast.error("Failed to book date", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const isDateBooked = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    return bookedDates.includes(formattedDate);
  };

  useEffect(() => {
    fetchService();
    fetchBookedDates();
  }, []);

  return (
    <div className="container mx-auto p-6 flex gap-8">
      <div className="flex-3">
        <div className="text-2xl font-bold">{service.title}</div>
        <Card className="flex items-center mt-3">
          <img
            src={""}
            alt={service.seller?.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{service.seller?.username}</div>
            <div className="text-sm text-gray-500">
              4 orders in queue
            </div>
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
                onChange={setDate}
                value={date}
                tileClassName={({ date }) =>
                  isDateBooked(date)
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : "bg-green-200"
                }
                tileDisabled={({ date }) => isDateBooked(date)}
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
