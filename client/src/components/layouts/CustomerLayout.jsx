import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ToastContainer } from "react-toastify";

const CustomerLayout = ({ component: Component }) => {
  return (
    <div className="bg-bg-color">
      <div className="pb-34">
        <Navbar />
      </div>

      <main className="flex justify-center mx-auto">
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
        <Component />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
