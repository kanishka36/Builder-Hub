import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
import ActionButton from "../../../components/Button/ActionButton";
import EditButton from "../../../components/Button/EditButton";
import DeleteButton from "../../../components/Button/DeleteButton";
import axios from "axios";

const Services = () => {
  const navigate = useNavigate();
  const [service, setService] = useState([]);

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
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/delete-service/${id}`, {
        withCredentials: true,
      });
      toast.success("Service deleted successfully", {
        position: "top-center",
        autoClose: 1500,
      });
      fetchService();
    } catch (error) {
      toast.error("Failed to delete service. Please try again.");
      console.log("Failed to delete service:", error);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    { header: "Price", accessor: "price" },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center space-x-4">
          <EditButton />
          <DeleteButton onClick={() => handleDelete(row._id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Service Management</h2>
      <div className="">
        <div className="flex justify-end mb-6">
          <ActionButton
            name={"+ Add New Service"}
            onClick={() => navigate("/dashboard/add-services")}
          />
        </div>
        <Table columns={columns} data={service} />
      </div>
    </div>
  );
};

export default Services;
