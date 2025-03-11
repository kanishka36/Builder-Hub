import React from "react";
import Card from "../Card";
import Navbar from "../Navbar";
import { ToastContainer } from "react-toastify";

const AuthLayout = ({ component: Component, name: name }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-color">
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
      <div className=""><Navbar /></div>
      <Card className="w-full max-w-md p-8">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          {name}
        </h2>
        <Component />
      </Card>
    </div>
  );
};

export default AuthLayout;
