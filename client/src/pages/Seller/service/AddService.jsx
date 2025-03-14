import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import ActionButton from "../../../components/Button/ActionButton";
import Card from "../../../components/UI/Card";
import TextField from "../../../components/Form/TextField";
import axios from "axios";
import TextArea from "../../../components/Form/TextArea";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddService = () => {
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const sellerId = currentUser._id;

  // Handle Form Submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post(`${apiUrl}/api/add-service/${sellerId}`, values, {
        withCredentials: true,
      });
      toast.success("Service added successfully", {
        position: "top-center",
        autoClose: 1500,
      });
      resetForm();
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Failed to add service. Please try again.");
    }
    setSubmitting(false);
  };

  // Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Price should be a number")
      .required("Price is required"),
  });

  return (
    <div className="">
      <Link to="/" className="text-blue-700">
        Back
      </Link>
      <h2 className="text-2xl font-semibold mb-6">Add Service</h2>

      <Card>
        <Formik
          initialValues={{
            title: "",
            description: "",
            price: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextField name={"title"} label={"Title"} />
              <div className="mt-4">
                <TextArea name={"description"} rows={4} label={"Description"} />
              </div>
              <div className="mt-4">
                <TextField name={"price"} label={"Price"} />
              </div>
              <div className="mt-6">
                <ActionButton name="Submit" disabled={isSubmitting} />
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default AddService;
