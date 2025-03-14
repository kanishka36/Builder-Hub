import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import TextField from "../../components/Form/TextField";
import SubmitButton from "../../components/Button/SubmitButton";

const Login = () => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("Password is required"),
  });

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch(signInStart());
      const res = await axios.post(`${apiUrl}/api/user/login`, values, {
        withCredentials: true,
      });
      dispatch(signInSuccess(res.data.user));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <TextField name={"email"} label={"Email"} />
            </div>

            <div>
              <TextField name={"password"} label={"Password"} />
            </div>

            <div>
              <SubmitButton name={"Login"} disabled={isSubmitting} />
            </div>
          </Form>
        )}
      </Formik>

      <div className="flex justify-center mt-1">
        Don't have account?{" "}
        <Link className="text-blue-400 ml-1" to={"/sign-up"}>
          Create Account
        </Link>
      </div>
      <div className="flex justify-center mt-1">
        <Link className="text-blue-400 ml-1" to={"/forget-password"}>
          Forget Password
        </Link>
      </div>
    </div>
  );
};

export default Login;
