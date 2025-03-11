import React from "react";
import Card from "../components/Card";
import ActionButton from "../components/Button/ActionButton";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="container mx-auto">
      <div className="text-2xl font-semibold">My Profile</div>

      <Card className="p-4 mt-6">
        <div className="text-xl font-semibold">Personal Profile</div>
        <div className="mt-4 flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          <div>
            <div className="text-lg font-medium">{currentUser?.username}</div>
            <div className="text-sm text-gray-600">{currentUser?.email}</div>
            <div className="text-sm text-gray-600">
              {currentUser?.address && currentUser.address.length > 0
                ? currentUser.address
                : "N/A"}
            </div>
            <div className="text-sm text-gray-600">
              {currentUser?.phoneNumber && currentUser.phoneNumber.length > 0
                ? currentUser.phoneNumber
                : "N/A"}
            </div>
          </div>
          <ActionButton className="ml-auto" name={"Edit"} />
        </div>
      </Card>

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
