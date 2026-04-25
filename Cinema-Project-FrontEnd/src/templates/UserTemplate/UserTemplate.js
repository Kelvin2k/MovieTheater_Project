import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import HeaderCopy from "./HeaderCopy";

const UserTemplate = () => {
  const { isActive } = useSelector((state) => state.loadingSlice);

  return (
    <div
      className=""
      style={{
        backgroundColor: "#0B2129",
      }}
    >
      {isActive ? <Loading /> : null}
      <div>
        <HeaderCopy />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default UserTemplate;
