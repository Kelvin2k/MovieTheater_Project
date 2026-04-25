import Lottie from "lottie-react";
import React from "react";
import animation404 from "./../../assets/animation/404.json";

const Page404 = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation404,
    style: { height: 400 },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Lottie {...defaultOptions} />
      <h2 className="uppercase font-bold text-5xl">Page not found!</h2>
    </div>
  );
};

export default Page404;
