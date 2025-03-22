import React from "react";
import { X } from "lucide-react";

const CloseButton = ({onClick}) => {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-red-500 transition"
    >
      <X size={24} />
    </button>
  );
};

export default CloseButton;
