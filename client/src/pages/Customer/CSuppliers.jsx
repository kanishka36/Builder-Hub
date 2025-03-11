import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";
import ActionButton from "../../components/Button/ActionButton";

const SupplierCard = ({ supplie }) => {
  const navigate = useNavigate();
  return (
    <Card className="rounded-lg shadow-lg overflow-hidden">
      <img
        src={supplie.image}
        alt={supplie.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{supplie.role?.name}</h2>
        <p className="text-sm text-gray-600">{supplie?.username}</p>
        <div className="flex items-center mt-2">
          <Star className="text-yellow-500" />
          <span className="ml-1 font-semibold">{supplie.rating}</span>
          <span className="text-gray-500 ml-2">
            ({supplie.reviews} reviews)
          </span>
        </div>
        <div className="flex justify-end">
          <ActionButton
            name={"Shop Now"}
            onClick={() => navigate(`/suppliers/${supplie._id}`)}
          />
        </div>
      </div>
    </Card>
  );
};

const CSuppliers = () => {
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchSupplie = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-suppliers`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setSupplier(data);
    } catch (error) {
      console.log("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplie();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {supplier.map((supplie) => (
          <div key={supplie._id}>
            <SupplierCard supplie={supplie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSuppliers;
