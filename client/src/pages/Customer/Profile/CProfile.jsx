import React, { useState } from "react";
import { useSelector } from "react-redux";
import CManageProfile from "./CManageProfile";
import CProfileSidebar from "../../../components/UI/CProfileSidebar";
import COrderManage from "./COrderManage";
import CBookings from "./CBookings";

const CProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  // State to track the active section
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="container mx-auto">
      <div className="bg-gray-100 min-h-screen">
        <div className="flex gap-5">
          {/* Left Sidebar */}
          <CProfileSidebar setActiveSection={setActiveSection} />

          {/* Main Content: Render component based on activeSection */}
          <div className="flex-1">
            {activeSection === "profile" && <CManageProfile />}
            {activeSection === "bookings" && <CBookings />}
            {activeSection === "orders" && <COrderManage />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CProfile;
