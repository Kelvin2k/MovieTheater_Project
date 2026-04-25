import Lottie from "lottie-react";
import React from "react";
import * as loadingAnimation from "./../../assets/animation/loadingAnimation.json";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    style: { height: "100%", width: "100%" },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      style={{ zIndex: "999" }}
    >
      <Lottie {...defaultOptions} />
    </div>
  );
};

export default Loading;
