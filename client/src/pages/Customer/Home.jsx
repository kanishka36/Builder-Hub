import React from "react";
import HeroSection from "../../components/HeroSection";
import Slider from "../../components/Slider";

const Home = () => {
  return (
    <>
      <div className="container mx-auto">
        <div className="">
          <HeroSection />
        </div>
        <div className="mt-16">
          <div className="">Services</div>
          <div className="mx-8">
            <Slider />
          </div>
        </div>
        <div className="mt-16">
          <div className="">Supplier</div>
          <div className="mx-8">
            <Slider />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
