import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authenticateFailure, signOutSuccess } from "../../redux/user/userSlice";
import axios from "axios";
import Card from "./Card";

const CProfileSidebar = ({ setActiveSection }) => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.category || currentUser.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  const menu = [
    { name: "My Profile", section: "profile" },
    { name: "My Bookings", section: "bookings" },
  ];

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/api/logout`, {}, { withCredentials: true });
      dispatch(signOutSuccess());
      dispatch(authenticateFailure());
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-64 text-black flex flex-col">
      <nav className="flex-1 py-4 pl-4">
        <ul className="space-y-2">
          {menu.map((item, i) => (
            <li key={i}>
              <button
                onClick={() => setActiveSection(item.section)}
                className="block w-full text-left px-3 py-2 rounded-s hover:bg-bg-color hover:text-black"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-bg-color">
        <button
          onClick={logout}
          className="flex gap-3 w-full text-left px-3 py-2 rounded hover:bg-bg-color hover:text-black"
        >
          Logout
        </button>
      </div>
    </Card>
  );
};

export default CProfileSidebar;
