import React from "react";
import * as animationData from "./../../assets/animation/TrailLoading.json";
import Lottie from "lottie-react";

const TrailLoading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    style: { height: "50%", width: "50%" },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="z-9999 flex justify-center items-center">
      <Lottie {...defaultOptions} />
    </div>
  );
};

export default TrailLoading;
