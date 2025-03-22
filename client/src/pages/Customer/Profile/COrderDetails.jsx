import React from "react";
import Card from "../../../components/UI/Card";
import CloseButton from "../../../components/Button/CloseButton";

const COrderDetails = ({ order, onClose }) => {
  if (!order) return null;
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  return (
    <div className="container mx-auto p-4">
      <Card className="">
        <div className="flex justify-end">
          <CloseButton onClick={onClose} />
        </div>
      </Card>
    </div>
  );
};

export default COrderDetails;
