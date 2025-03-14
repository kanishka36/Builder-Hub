import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="container items-center justify-center">
      <Slider {...settings}>
        {data.map((name, i) => (
          <div key={i} className="h-10 border w-[90%]">
            <h3>{name}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
}
