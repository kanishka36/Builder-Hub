import React from "react";

const ActionButton = ({ onClick, name, type }) => {
  return (
    <button
      type={type}
      className="bg-primary px-2 py-1 rounded-md"
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default ActionButton;
