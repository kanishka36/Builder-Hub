import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import ActionButton from "../../components/Button/ActionButton";
import EditButton from "../../components/Button/EditButton";
import DeleteButton from "../../components/Button/DeleteButton";
import axios from "axios";

const ASellerRole = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState([]);

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchRole = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-role`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setRole(data);
    } catch (error) {
      console.log("Failed to fetch role:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/delete-role/${id}`, {
        withCredentials: true,
      });
      toast.success("Role deleted successfully", {
        position: "top-center",
        autoClose: 1500,
      });
      fetchRole();
    } catch (error) {
      toast.error("Failed to delete role. Please try again.");
      console.log("Failed to delete role:", error);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const columns = [
    { header: "Role Name", accessor: "name" },
    { header: "Seller Category", accessor: "category" },
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
      <h2 className="text-2xl font-semibold mb-6">Seller Role Management</h2>
      <div className="">
        <div className="flex justify-end mb-6">
          <ActionButton
            name={"+ Add New Service"}
            onClick={() => navigate("/dashboard/add-seller-role")}
          />
        </div>
        <Table columns={columns} data={role} />
      </div>
    </div>
  );
};

export default ASellerRole;
