import React from "react";
import Sidebar from "../UI/Sidebar";
import { Bell } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const AdminLayout = ({ component: Component }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex h-screen">
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
      <Sidebar />

      <main className="flex-1 bg-bg-color">
        <div className="bg-white flex items-center h-14">
          <div className="container flex items-center justify-end mx-auto">
            <Bell className="text-black cursor-pointer mr-3" size={30} />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col items-end pr-2 border-primary border-e-4">
                <p className="font-semibold text-gray-900">{currentUser?.username}</p>
                <p className="text-sm text-gray-500">{currentUser?.role }</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto p-6">
          <Component />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
