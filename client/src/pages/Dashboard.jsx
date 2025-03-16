import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Card from "../components/UI/Card";
import ActionButton from "../components/Button/ActionButton";
import TextField from "../components/Form/TextField";
import FileUpload from "../components/Form/FileUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { updateUserSuccess } from "../redux/user/userSlice";
import SetLocation from "../components/SetLocation";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [toggle, setToggle] = useState(false);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const dispatch = useDispatch();

  // Initial values for Formik
  const initialValues = {
    images: currentUser?.imageUrl || [],
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    address: currentUser?.address || "",
    phoneNumber: currentUser?.phoneNumber || "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().notRequired(),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .notRequired(),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    console.log("Updated Profile Data:", values);

    try {
      const res = await axios.put(
        `${apiUrl}/api/edit-seller/${currentUser._id}`,
        {
          username: values.username,
          email: values.email,
          address: values.address,
          phoneNumber: values.phoneNumber,
          imageUrl: values.imageUrl,
        },
        { withCredentials: true }
      );
      const data = res.data.data;
      dispatch(updateUserSuccess(data));
      setIsEditing(false);
      console.log(data, "updated seller data");
      toast.success("Updated seller successfully", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (error) {
      console.log("Failed to update seller:", error);
      toast.error("Failed to update seller", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const handleEdit = () => {
    setToggle(!toggle);
  };

  return (
    <div className="container mx-auto">
      <div className="text-2xl font-semibold">My Profile</div>

      <div className="mt-6 grid grid-cols-1">
        <Card className="p-4 mt-6 mr-3">
          <div className="flex gap-3">
            <div className="text-xl font-semibold">Personal Profile</div>
            <div className="">
              <ActionButton
                name={isEditing ? "Cancel" : "Edit"}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>
          </div>
          <div className="">
            {!isEditing && (
              <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden">
                {currentUser?.imageUrl ? (
                  <img
                    src={currentUser.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500 flex items-center justify-center h-full">
                    No Image
                  </span>
                )}
              </div>
            )}
            <div className="">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-3">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ setFieldValue, isSubmitting }) => (
                      <Form className="space-y-2">
                        <div>
                          <FileUpload
                            name="images"
                            label={"Uploade Profile Picture"}
                            onUploadComplete={(uploadedURLs) => {
                              console.log("Uploaded URLs:", uploadedURLs); // Debugging
                              setFieldValue("images", uploadedURLs);
                            }}
                            multiple={false}
                          />
                        </div>
                        <div>
                          <TextField name={"username"} label={"Username"} />
                        </div>

                        <div>
                          <TextField name={"email"} label={"Email"} />
                        </div>

                        <div>
                          <TextField name={"address"} label={"Address"} />
                        </div>

                        <div>
                          <TextField
                            name={"phoneNumber"}
                            label={"Phone Number"}
                          />
                        </div>

                        <div className="flex space-x-4">
                          <ActionButton type="submit" name="Save" />
                          <ActionButton
                            type="button"
                            name="Cancel"
                            onClick={() => setIsEditing(false)}
                          />
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <div className="">
                    <div className="flex gap-3">
                    <div className="text-xl font-semibold">Update Geographical Location</div>
                      <ActionButton
                        name={`${toggle ? "Cancel" : "Edit"}`}
                        onClick={handleEdit}
                      />
                    </div>
                    <div className={`${toggle ? "block" : "hidden"} `}>
                      <SetLocation />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-lg font-medium">
                    {currentUser?.username}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentUser?.email}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentUser?.address || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentUser?.phoneNumber || "N/A"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-4xl font-normal">1,154</div>
          <div className="text-gray-600 text-lg">Completed Orders</div>
        </Card>
        <Card className="p-4">
          <div className="text-4xl font-normal">3</div>
          <div className="text-gray-600 text-lg">Pending Orders</div>
        </Card>
      </div>

      <Card className="p-4 mt-6">
        <div className="text-xl font-semibold">My Documents</div>
      </Card>
    </div>
  );
};

export default Dashboard;
