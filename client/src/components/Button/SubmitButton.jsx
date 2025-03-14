import React from "react";

const SubmitButton = ({ name }) => {
  return (
    <button type="submit" className="bg-primary px-2 py-1 rounded-md">
      {name}
    </button>
  );
};

export default SubmitButton;
