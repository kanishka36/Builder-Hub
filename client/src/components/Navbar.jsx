import React from "react";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <nav className="bg-gray-900 text-white p-6 fixed top-0 left-0 w-full z-50">
      <div className="container flex justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link to={"/"} className="text-primary text-xl font-bold">BuilderHub</Link>
          <Link to={"/services"} className="text-gray-300 hover:text-white">
            Services
          </Link>
          <Link to={"/suppliers"} className="text-gray-300 hover:text-white">
            Suppliers
          </Link>
          <Link to={"/seller/sign-in"} className="text-gray-300 hover:text-white">
            Seller
          </Link>
        </div>

        <div className="flex items-center w-1/3 border-2 border-gray-700 rounded-md bg-white px-3 py-1">
          <input
            type="text"
            placeholder="Search"
            className="w-full outline-none text-black px-2"
          />
          <Search className="text-gray-600 cursor-pointer" size={20} />
        </div>

        <div className="flex items-center gap-4">
          <Filter className="text-gray-400 cursor-pointer" size={22} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-500 rounded-full" />
            <div className="text-gray-300">Hi, {currentUser?.username}</div>
          </div>
          <div className="relative cursor-pointer">
            <ShoppingCart className="text-primary" size={24} />
            <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold rounded-full px-1">
              2
            </div>
          </div>
          <Link to={"/sign-in"} className="text-gray-300 hover:text-white">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
