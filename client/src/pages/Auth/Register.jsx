import React from "react";
import { Formik, Form } from "formik";
import TextField from "../../components/Form/TextField"
import * as Yup from "yup";
import axios from "axios";
import ActionButton from "../../components/Button/ActionButton"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {

  const navigate = useNavigate()

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),  
    phoneNumber: Yup.number()
      .typeError("Phone number must be a valid number")
      .integer("Phone number must be an integer")
      .positive("Phone number must be positive"),
    address: Yup.string(),
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
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
  };

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const handleSubmit = async (values ,{ setSubmitting, resetForm }) => {
    try {
      await axios.post(`${apiUrl}/api/user/register`, values, {
        withCredentials: true,
      });
      toast.success("Registered!", {
        position: "top-center",
        autoClose: 1500,
      });
      resetForm();
      navigate("/sign-in")
    } catch (error) {
      console.log(error);
      toast.error("Registration Failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <TextField type={"text"} name={"username"} label={"Username"} />
            </div>
            <div className="flex gap-2">
              <TextField type={"text"} name={"firstName"} label={"First Name"} />
              <TextField type={"text"} name={"lastName"} label={"Last Name"} /> 
            </div>
            <div className="flex gap-2">
              <TextField type={"email"} name={"email"} label={"Email"} />
              <TextField type={"text"} name={"phoneNumber"} label={"Phone Number"} />
            </div>
            <div>
              <TextField type={"text"} name={"address"} label={"Address"} />
            </div>
            <div>
              <TextField type={"text"} name={"city"} label={"City"} />
            </div>
            <div>
              <TextField type={"password"} name={"password"} label={"Password"} />
            </div>
            <div>
              <TextField type={"password"} name={"confirmPassword"} label={"Confirm Password"} />
            </div>
            <div>
              <ActionButton name={"Register"} disabled={isSubmitting} />
            </div>
          </Form>
        )}
      </Formik>
      <div className="flex justify-center mt-1">Already have a account? <Link className="text-blue-400 ml-1" to={"/sign-in"}>Sign in</Link></div>
    </div>
  );
};

export default Register;