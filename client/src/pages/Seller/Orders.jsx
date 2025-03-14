import React, { useState } from "react";
import Table from "../../components/UI/Table";
import ActionButton from "../../components/Button/ActionButton";
import EditButton from "../../components/Button/EditButton"
import DeleteButton from "../../components/Button/DeleteButton"

const Orders = () => {
  const [posts, setPosts] = useState([
    { title: "Plumbing Repair", content: "Fixing leaks and pipe issues." },
    {
      title: "Drain Cleaning",
      content: "Unclogging and maintenance of drains.",
    },
    {
      title: "Water Heater Installation",
      content: "Installing and repairing water heaters.",
    },
  ]);

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Content", accessor: "content" },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center space-x-4">
          <EditButton />
          <DeleteButton />
        </div>
      ),
    },
  ];
  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Order Management</h2>
      <div className="">
        <div className="flex justify-end mb-6">
          <ActionButton name={"+ Add New Service"} />
        </div>
        <Table columns={columns} data={posts} />
      </div>
    </div>
  );
};

export default Orders;
