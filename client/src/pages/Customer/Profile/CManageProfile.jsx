import React, { useState } from "react";
import Card from "../../../components/UI/Card";
import ActionButton from "../../../components/Button/ActionButton";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../../../components/Form/TextField";
import FileUpload from "../../../components/Form/FileUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { updateUserSuccess } from "../../../redux/user/userSlice";
import SubmitButton from "../../../components/Button/SubmitButton";

const CManageProfile = () => {
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    images: currentUser?.imageUrl || [],
    username: currentUser?.username || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "",
    phoneNumber: currentUser?.phoneNumber || "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .notRequired(),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    console.log("Updated Profile Data:", values);

    try {
      const res = await axios.put(
        `${apiUrl}/api/edit-user/${currentUser?._id}`,
        {
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          imageUrl: values.images,
          address: values.address,
          phoneNumber: values.phoneNumber,
          city: values.city,
        },
        { withCredentials: true }
      );
      const data = res.data.data;
      dispatch(updateUserSuccess(data));
      setIsEditing(false);
      console.log(data, "Updated user data");
      toast.success("Updated user successfully", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (error) {
      console.log("Failed to update user:", error);
      toast.error("Failed to update user", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };
  return (
    <>
      <div className="">
        <h1 className="text-2xl font-medium text-gray-800 mb-6">
          Manage Account
        </h1>

        {/* Personal Profile Card */}
        <div className="mb-3 min-h-64">
          <Card className={`${isEditing ? "absolute w-1/2" : ""}`}>
            <div className="flex gap-3">
              <div className="text-xl font-semibold">Personal Profile</div>
              <div className="">
                <ActionButton
                  className="ml-auto"
                  name={isEditing ? "Cancel" : "Edit"}
                  onClick={() => setIsEditing(!isEditing)}
                />
              </div>
            </div>
            <div className="flex">
              {isEditing ? (
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

                      <TextField name={"username"} label={"Username"} />
                      <div className="flex gap-2">
                        <TextField name={"firstName"} label={"First Name"} />
                        <TextField name={"lastName"} label={"Last Name"} />
                      </div>
                      <TextField name={"email"} label={"Email"} />
                      <TextField name={"address"} label={"Address"} />
                      <TextField name={"city"} label={"City"} />
                      <TextField name={"phoneNumber"} label={"Phone Number"} />

                      <div className="flex space-x-4">
                        <SubmitButton name={"Save"} />
                        <ActionButton
                          name="Cancel"
                          onClick={() => setIsEditing(false)}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div>
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
                  </div>
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
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Recent Orders
          </h2>

          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left py-3 px-4">Order#</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Services/Supplies</th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 px-4">00152535</td>
                <td className="py-4 px-4">05/01/2025</td>
                <td className="py-4 px-4">Architecture Service</td>
                <td className="py-4 px-4 text-right">Rs. 8,430</td>
              </tr>
              <tr>
                <td className="py-4 px-4">00152534</td>
                <td className="py-4 px-4">04/01/2025</td>
                <td className="py-4 px-4">Sand from Kandy Hardware</td>
                <td className="py-4 px-4 text-right">Rs. 52,300</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
};

export default CManageProfile;
