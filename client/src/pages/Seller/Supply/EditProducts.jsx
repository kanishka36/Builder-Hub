import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import SubmitButton from "../../../components/Button/SubmitButton";
import Card from "../../../components/UI/Card";
import TextField from "../../../components/Form/TextField";
import axios from "axios";
import TextArea from "../../../components/Form/TextArea";
import { toast } from "react-toastify";
import FileUpload from "../../../components/Form/FileUpload";

const EditProducts = () => {
  const { state } = useLocation(); // Get the passed product data
  const navigate = useNavigate();

  const product = state?.product; // Extract product data

  // If no product is passed, redirect back
  useEffect(() => {
    if (!product) {
      navigate("/dashboard/products");
    }
  }, [product, navigate]);

  // Initial values directly from state (No need to fetch!)
  const initialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    images: product?.images || [],
    quantity: product?.quantity || "",
  };

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Price should be a number")
      .required("Price is required"),
    quantity: Yup.number()
      .typeError("Quantity should be a number")
      .required("Quantity is required"),
  });

  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const { productId } = useParams();

  // Handle Form Submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    try {
      await axios.put(`${apiUrl}/api/edit-product/${productId}`, values, {
        withCredentials: true,
      });
      toast.success("Product added successfully", {
        position: "top-center",
        autoClose: 1500,
      });
      navigate("/dashboard/products");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="">
      <Link to="/" className="text-blue-700">
        Back
      </Link>
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>

      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <TextField name={"name"} label={"Name"} />
              <div className="mt-4">
                <TextArea name={"description"} rows={4} label={"Description"} />
              </div>
              <div className="mt-4">
                <TextField name={"price"} label={"Price"} />
              </div>
              <div className="mt-4">
                <TextField name={"quantity"} label={"Quantity"} />
              </div>
              <div className="mt-6">
                <FileUpload
                  name="images"
                  label={"Uploade Profile Picture"}
                  onUploadComplete={(uploadedURLs) => {
                    console.log("Uploaded URLs:", uploadedURLs); // Debugging
                    setFieldValue("images", uploadedURLs);
                  }}
                  multiple={true}
                />
              </div>
              <div className="mt-6">
                <SubmitButton name="Submit" disabled={isSubmitting} />
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default EditProducts;
