import { adminHttps, https } from "./configServ";

export const userServ = {
  loginServ: (data) => {
    return https.post("/user/user-login", data);
  },
  signUpServ: (data) => {
    return https.post("/user/user-register", data);
  },

  updateUserInfo_User: (data) => {
    return adminHttps.post("/user/update-user", data);
  },

  updateUserInfo_Admin: (data) => {
    return https.post("/user/update-user", data);
  },

  findUser: (key) => {
    return https.get(`/user/get-user-info?key=${key}`);
  },
  fetchUserDataList: () => {
    return https.get("/user/get-all-user");
  },
  removeUser: (userAccount) => {
    return https.delete(`/user/delete-user?Account_Id=${userAccount}`);
  },
  addUser: (data) => {
    return https.post("/user/add-user", data);
  },
  fetchUserData_Admin: (accountId) => {
    return https.post(`/user/get-account-info?AccountId=${accountId}`);
  },
  fetchUserData_User: (accountId) => {
    return adminHttps.post(`/user/get-account-info?AccountId=${accountId}`);
  },
};
