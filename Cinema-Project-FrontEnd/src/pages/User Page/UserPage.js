import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { userServ } from "../../services/userServ";
import { useDispatch } from "react-redux";
import UpdateUserInformation from "./UpdateUserInformation";
import TicketHistoryTab from "./TicketHistoryTab";
import { endedLoading, startedLoading } from "../../redux/Slice/loadingSlice";
import { getLocalStorage } from "../../utils/local";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const navigate = useNavigate();
  const onChange = (key) => {
    if (key === 0) {
      setTitle("Your Personal Information");
    } else {
      setTitle("Your Booking Ticket History");
    }
  };
  const arrTab = ["User Information", "Ticket History"];
  const [title, setTitle] = useState("Your Personal Information");
  const [userData, setUserData] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startedLoading());
    const userInfo = getLocalStorage("userInfo");
    if (!userInfo?.name) {
      navigate("/login");
      return;
    }
    const accountId = getLocalStorage("userInfo").account_id;

    userServ
      .fetchUserData_User(accountId)
      .then((result) => {
        setUserData(result.data);
        dispatch(endedLoading());
      })
      .catch((err) => {
        dispatch(endedLoading());
      });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen pt-10 bg-white">
      <h1 className="uppercase text-3xl text-center font-bold">{title}</h1>
      <div
        className="container mx-auto p-5 rounded-lg my-5"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Tabs
          onChange={onChange}
          type="card"
          items={arrTab.map((item, index) => {
            return {
              label: item,
              key: index,
              children: (
                <>
                  {index === 0 ? (
                    <UpdateUserInformation userData={userData} />
                  ) : (
                    <TicketHistoryTab userData={userData} />
                  )}
                </>
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

export default UserPage;
