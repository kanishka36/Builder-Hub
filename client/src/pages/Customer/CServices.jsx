import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Star } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingPage from "../../components/LoadingPage";

// const services = [
//   {
//     id: 1,
//     title: "Professional Squarespace Website",
//     name: "David Narclso",
//     rating: 5.0,
//     reviews: 204,
//     price: 160,
//     tag: "Fiverr's Choice",
//     image: "/images/service1.png",
//   },
// ];

const ServiceCard = ({ service }) => {
  return (
    <Card className="rounded-lg shadow-lg overflow-hidden">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{service.title}</h2>
        <p className="text-sm text-gray-600">{service.seller?.username}</p>
        <div className="flex items-center mt-2">
          <Star className="text-yellow-500" />
          <span className="ml-1 font-semibold">{service.rating}</span>
          <span className="text-gray-500 ml-2">
            ({service.reviews} reviews)
          </span>
        </div>
        <p className="mt-2 font-semibold">From ${service.price}</p>
        <span className="inline-block mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {service.tag}
        </span>
      </div>
    </Card>
  );
};

const CServices = () => {
  const [services, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchService = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-service`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setService(data);
    } catch (error) {
      console.log("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Link key={service._id} to={`/services/${service._id}`}>
            <ServiceCard service={service} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CServices;
