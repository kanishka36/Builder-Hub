import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ActionButton from "../../components/Button/ActionButton";
import Card from "../../components/UI/Card";
import TextField from "../../components/Form/TextField";
import axios from "axios";
import { toast } from "react-toastify";
import RadioField from "../../components/Form/RadioField";
import BackButton from "../../components/Button/BackButton";

const AAddSellerRole = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  // Handle Form Submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post(`${apiUrl}/api/add-role`, values, {
        withCredentials: true,
      });
      toast.success("Role added successfully", {
        position: "top-center",
        autoClose: 1500,
      });
      resetForm();
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Failed to add role. Please try again.");
    }
    setSubmitting(false);
  };

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Role name is required"),
    category: Yup.string().required("Category is required"),
  });
  return (
    <div className="">
      <BackButton onClick={() => navigate(-1)} />
      <h2 className="text-2xl font-semibold mb-6">Add Service</h2>

      <Card>
        <Formik
          initialValues={{
            name: "",
            category: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextField name={"name"} label={"Role Name"} />
              <div className="mt-4">
                <RadioField
                  name={"category"}
                  label={"Select Category"}
                  options={[
                    { label: "Service Provider", value: "service-provider" },
                    { label: "Supplier", value: "supplier" },
                  ]}
                  col={2}
                />
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

export default AAddSellerRole;
