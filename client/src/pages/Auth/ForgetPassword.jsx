import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ActionButton from "../../components/Button/ActionButton"
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post(`${apiUrl}/api/forget-password`, values, {
        withCredentials: true,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label-style">
                Email:
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="field-style"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>
            <div>
              <ActionButton name={"Submit"} disabled={isSubmitting} />
            </div>
          </Form>
        )}
      </Formik>

      <div className="flex justify-center mt-1">
        <Link className="text-blue-400 ml-1" to={"/sign-in"}>
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
