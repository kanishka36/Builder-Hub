import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form } from "formik";
import TextField from "../../components/Form/TextField";
import SelectField from "../../components/Form/SelectField";
import * as Yup from "yup";
import axios from "axios";
import ActionButton from "../../components/Button/ActionButton";
import { Link, useNavigate } from "react-router-dom";
import RadioField from "../../components/Form/RadioField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerRegister = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  // Fetch roles function (useCallback to prevent re-creation)
  const fetchRoles = useCallback(async (category) => {
    if (!category) return;
    try {
      const res = await axios.get(`${apiUrl}/api/view-role/${category}`, {
        withCredentials: true,
      });
      setRoles(res.data.data);
    } catch (error) {
      setRoles([]);
      console.error("Failed to fetch roles:", error);
    }
  }, [apiUrl]);


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post(`${apiUrl}/api/seller/register`, values, {
        withCredentials: true,
      });
      toast.success("Registered!", {
        position: "top-center",
        autoClose: 1500,
      });
      resetForm();
      navigate("/seller/sign-in");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration Failed. Please try again.");
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    category: Yup.string().required("Category is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initialValues = {
    username: "",
    email: "",
    category: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => {
          useEffect(() => {
            fetchRoles(values.category);
          }, [values.category, fetchRoles]);

          return (
            <Form className="space-y-6">
              <TextField type="text" name="username" label="Username" />
              <TextField type="email" name="email" label="Email" />
              <RadioField
                name="category"
                label="Select Category"
                options={[
                  { label: "Service Provider", value: "service-provider" },
                  { label: "Supplier", value: "supplier" },
                ]}
                col={2}
              />
              <SelectField name="role" label="Role" items={roles} />
              <TextField type="password" name="password" label="Password" />
              <TextField type="password" name="confirmPassword" label="Confirm Password" />
              <div>
                <ActionButton name="Register" disabled={isSubmitting} />
              </div>
            </Form>
          );
        }}
      </Formik>
      <div className="flex justify-center mt-1">
        Already have an account?{" "}
        <Link className="text-blue-400 ml-1" to="/seller/sign-in">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SellerRegister;
