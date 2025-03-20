import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../../../components/UI/Table";
import ActionButton from "../../../components/Button/ActionButton";
import EditButton from "../../../components/Button/EditButton";
import DeleteButton from "../../../components/Button/DeleteButton";
import axios from "axios";
import { useSelector } from "react-redux";

const Products = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const sellerId = currentUser?._id;

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/view-products/${sellerId}`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setProduct(data);
    } catch (error) {
      console.log("Failed to fetch category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/delete-product/${id}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully", {
        position: "top-center",
        autoClose: 1500,
      });
      fetchProduct();
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
      console.log("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleEdit = (product) => {
    navigate(`/dashboard/edit-product/${product._id}`, { state: { product } });
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Price", accessor: "price" },
    { header: "Quantity", accessor: "quantity"},
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center space-x-4">
          <EditButton onClick={() => handleEdit(row)} />
          <DeleteButton onClick={() => handleDelete(row._id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Product Management</h2>
      <div className="">
        <div className="flex justify-end mb-6">
          <ActionButton
            name={"+ Add New Product"}
            onClick={() => navigate("/dashboard/add-products")}
          />
        </div>
        <Table columns={columns} data={product} />
      </div>
    </div>
  );
};

export default Products;
