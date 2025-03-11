import React from "react";

const BackButton = ({ onClick }) => {
  return (
    <button className="text-blue-700" onClick={onClick}>
      Back
    </button>
  );
};

export default BackButton;
