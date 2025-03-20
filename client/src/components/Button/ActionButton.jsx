import React from "react";

const ActionButton = ({ onClick, name, type = "button", disabled }) => {
  return (
    <button
      type={type}
      className={`px-2 py-1 rounded-md transition-all 
        ${
          disabled
            ? "bg-yellow-200 cursor-not-allowed"
            : "bg-primary cursor-pointer hover:bg-primary-dark"
        }
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default ActionButton;
