import React from "react";
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="bg-gray-900 text-white px-10 py-40 flex flex-col items-center text-center rounded-lg">
      <div className="flex flex-col justify-center items-center w-2/3">
        <div className="text-4xl md:text-6xl font-semibold">
          Scale your professional workforce with <i>freelancers</i>
        </div>
        <div className="mt-6 flex items-center bg-white rounded-md px-4 py-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Search for any service..."
            className="w-full text-black outline-none px-2"
          />
          <Search className="text-gray-600 cursor-pointer" size={24} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
