import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { userServ } from "../../services/userServ";
import { Modal } from "antd";
import "./UserManger.css";
import ManagerAddUser from "./ManagerAddUser";
import ManagerUpdateUser from "./ManagerUpdateUser";
import { Button, message, Popconfirm, Space } from "antd";

const UserManager = () => {
  const [messageApi] = message.useMessage();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title = "", description = "") => {
    api[type]({
      title: title,
      description: description,
    });
  };

  const confirm = (e, accountId) => {
    userServ
      .removeUser(accountId)
      .then((result) => {
        openNotificationWithIcon(
          "success",
          "Delete User Successful",
          "User has been deleted successfully.",
        );
        userServ
          .fetchUserDataList()
          .then((result) => {
            setUserList(result.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        const errMsg =
          err?.response?.data?.message ||
          "Failed to add user. Please try again.";
        openNotificationWithIcon("error", "Delete User Failed", errMsg);
      });
  };
  const cancel = (e) => {
    messageApi.error("Click on No");
  };

  const [userList, setUserList] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  useEffect(() => {
    userServ
      .fetchUserDataList()
      .then((result) => {
        setUserList(result.data);
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: "Account",
      dataIndex: "account_id",
      key: "account_id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "200px",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
    },
    {
      title: "Action",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <div className="space-x-2">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this user?"
            onConfirm={(e) => {
              confirm(e, record.account_id);
            }}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <i className="fa-solid fa-trash text-red-500 text-lg cursor-pointer hover:text-xl duration-200"></i>
          </Popconfirm>
          <i
            className="fa-solid fa-pen-to-square text-lime-700 text-lg cursor-pointer hover:text-xl duration-200"
            onClick={() => {
              showModalUpdate();
              userServ
                .fetchUserData_Admin(record.account_id)
                .then((result) => {
                  setUserDataUpdate(
                    result.data?.data || result.data?.content || result.data,
                  );
                })
                .catch((err) => {});
            }}
          ></i>
        </div>
      ),
    },
  ];

  //modal

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [userDataUpdate, setUserDataUpdate] = useState("");

  const showModalAdd = () => {
    setOpenAdd(true);
  };
  const showModalUpdate = () => {
    setOpenUpdate(true);
  };

  const handleCancel = () => {
    setOpenAdd(false);
    setOpenUpdate(false);
  };

  return (
    <>
      {contextHolder}
      <div className="container mx-auto">
        <form
          className="w-full mt-5 mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            userServ
              .findUser(searchInputValue)
              .then((result) => {
                setUserList(result.data);
              })
              .catch((err) => {});
          }}
        >
          <div className="w-full mx-auto mb-5 grid grid-cols-2">
            <Space>
              <Button
                type="primary"
                onClick={showModalAdd}
                style={{
                  backgroundColor: "#49AF75",
                  color: "white",
                  padding: "20px 25px",
                  fontSize: "20px",
                }}
              >
                Add user
              </Button>
            </Space>
            <Modal
              open={openAdd}
              onCancel={handleCancel}
              footer={(_, { OkBtn, CancelBtn }) => (
                <>
                  <CancelBtn />
                </>
              )}
            >
              <ManagerAddUser
                setOpenAdd={setOpenAdd}
                setUserList={setUserList}
              />
            </Modal>
            <Modal
              open={openUpdate}
              onCancel={handleCancel}
              footer={(_, { OkBtn, CancelBtn }) => (
                <>
                  <CancelBtn />
                </>
              )}
            >
              <ManagerUpdateUser
                userDataUpdate={userDataUpdate}
                setOpenUpdate={setOpenUpdate}
                setUserList={setUserList}
              />
            </Modal>
            <label
              htmlFor="search"
              className="block mb-2.5 text-sm font-medium text-heading sr-only"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-body"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                placeholder="Search"
                onChange={(e) => {
                  setSearchInputValue(e.target.value);
                }}
              />
              <button
                type="submit"
                className="absolute inset-e-1.5 bottom-1.5 text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={userList}
            pagination={{ pageSize: 5 }}
            tableLayout="fixed"
            rowKey="account_id"
          />
          <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default"></div>
        </form>
      </div>
    </>
  );
};

export default UserManager;
