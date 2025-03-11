import React from "react";
import { Pencil } from "lucide-react";


const EditButton = ({ onClick }) => {
  return (
    <button className="text-blue-500" onClick={onClick}>
      <Pencil className="text-blue-600 cursor-pointer" size={20} />
    </button>
  );
};

export default EditButton;
