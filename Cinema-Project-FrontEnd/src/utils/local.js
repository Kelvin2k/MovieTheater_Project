export const saveLocalStore = (data, key) => {
  const dataJson = JSON.stringify(data);
  localStorage.setItem(key, dataJson);
};

export const getLocalStorage = (key = "userInfo") => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeKeyLocalStorage = (key = "userInfo") => {
  localStorage.removeItem(key);
};
