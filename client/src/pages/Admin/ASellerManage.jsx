import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/UI/Table";
import EditButton from "../../components/Button/EditButton";
import DeleteButton from "../../components/Button/DeleteButton";
import axios from "axios";

const ASellerManage = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState([]);

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchSeller = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-seller`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setSeller(data);
    } catch (error) {
      console.log("Failed to fetch role:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/delete-seller/${id}`, {
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

  useEffect(()=> {
    fetchSeller()
  }, [])

  console.log(seller)

  const columns = [
    { header: "Seller Name", accessor: "username" },
    { header: "Seller Category", accessor: "category" },
    { header: "Role", render: (row) => (
      <>{row.role.name}</>
    ) },
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
      <h2 className="text-2xl font-semibold mb-6">Seller Management</h2>
      <div className="">
        <Table columns={columns} data={seller} />
      </div>
    </div>
  )
}

export default ASellerManage