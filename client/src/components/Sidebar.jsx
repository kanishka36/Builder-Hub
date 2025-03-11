import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authenticateFailure, signOutSuccess } from "../redux/user/userSlice";
import axios from "axios";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser.category || currentUser.role;
  const [openMenus, setOpenMenus] = useState({});

  console.log(role, "role")

  const menu = [
    { name: "My Profile", path: "/dashboard/my-profile" },
    { name: "Service Manage", path: "/dashboard/services" },
    ...(role == "supplier" ? [
      { name: "Order Manage", path: "/dashboard/orders" },
    ]:[]),
    ...(role == "service-provider" ? [
      { name: "Bookings", path: "/dashboard/bookings" },
    ]:[]),
    ...(role == "admin"
      ? [
          { name: "Admins", path: "/admins" },
          { name: "Users", path: "/users" },
          {
            name: "Seller",
            path: "/seller",
            subMenu: [
              { name: "Seller", path: "/dashboard/seller-manage" },
              { name: "Role", path: "/dashboard/seller-role" },
            ],
          },
        ]
      : []),
    { name: "Inquiries", path: "/dashboard/inquiries" },
    { name: "Rating & Reviews", path: "/dashboard/rating" },
    { name: "Analytics", path: "/dashboard/analytics" },
  ];

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/api/logout`, {}, { withCredentials: true });
      dispatch(signOutSuccess());
      dispatch(authenticateFailure());
      navigate("/seller/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Link to={"/"} className="text-xl font-bold text-primary">
            BuilderHub
          </Link>
        </div>

        <nav className="flex-1 py-4 pl-4">
          <ul className="space-y-2">
            {menu.map((item, i) => {
              const isHome = item.path === "/";
              const isActive = isHome
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <li key={i}>
                  {item.subMenu ? (
                    <>
                      {/* Parent Menu Item */}
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-s ${
                          isActive
                            ? "bg-bg-color text-black border-s-6 border-primary"
                            : "hover:bg-bg-color hover:text-black"
                        }`}
                      >
                        {item.name}
                      </button>

                      {/* Submenu Items (Only shown if expanded) */}
                      {openMenus[item.name] && (
                        <ul className="pl-6 mt-1 space-y-1">
                          {item.subMenu.map((sub, j) => (
                            <li key={j}>
                              <Link
                                to={sub.path}
                                className={`block px-3 py-2 rounded-s ${
                                  location.pathname.startsWith(sub.path)
                                    ? "bg-bg-color text-black border-s-6 border-primary"
                                    : "hover:bg-bg-color hover:text-black"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded-s ${
                        isActive
                          ? "bg-bg-color text-black border-s-6 border-primary"
                          : "hover:bg-bg-color hover:text-black"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-bg-color">
          <button 
            onClick={logout}
            className="flex gap-3 w-full text-left px-3 py-2 rounded hover:bg-bg-color hover:text-black"
          >
            <div className="">Logout</div>
            <div className=""></div>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
