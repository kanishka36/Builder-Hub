import React from "react";
import { Field, ErrorMessage } from "formik";

const RadioField = ({ name, label, options = [], col }) => {
  return (
    <div>
      <label className="label-style">{label}</label>
      <div className={`mt-2 grid gap-2 grid-cols-${col}`}>
        {options.map((option, index) => (
          <label key={index} className="flex items-center gap-2">
            <Field
              type="radio"
              name={name}
              value={option.value}
              className="text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-500"
      />
    </div>
  );
};

export default RadioField;

