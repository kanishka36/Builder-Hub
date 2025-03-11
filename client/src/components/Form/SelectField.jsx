import React from "react";
import { Field, ErrorMessage } from "formik";

const SelectField = ({ name, label, items = [] }) => {
  return (
    <div className={`w-full`}>
      {label && <label className="label-style">{label}</label>}
      <Field as="select" name={name} className="field-style">
        <option value="" disabled>
          Select {label}
        </option>
        {items.map((item, i) => (
          <option key={item._id || i} value={item._id || item.value}>
            {item.name || item.role}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-500"
      />
    </div>
  );
};

export default SelectField;
