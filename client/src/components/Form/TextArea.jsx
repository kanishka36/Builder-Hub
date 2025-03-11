import React from "react";
import { Field, ErrorMessage } from "formik";

const TextArea = ({ name, rows, label }) => {
  return (
    <div>
      <label className="label-style">{label}</label>
      <Field as="textarea" rows={rows} name={name} className="field-style" />
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-500"
      />
    </div>
  );
};

export default TextArea;
