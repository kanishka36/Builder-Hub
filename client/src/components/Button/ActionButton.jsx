import React from "react";

const ActionButton = ({ onClick, name, type = "button", disabled }) => {
  return (
    <button
      type={type}
      className={`${disabled?"bg-yellow-200":"bg-primary"} px-2 py-1 rounded-md`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default ActionButton;
