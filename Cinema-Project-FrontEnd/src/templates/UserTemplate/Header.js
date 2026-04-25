import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { removeKeyLocalStorage } from "../../utils/local";
import { updateUserName } from "../../redux/Slice/userSlice";
import { notification } from "antd";

const Header = () => {
  const { userName } = useSelector((state) => state.userSlice);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title = "", description = "") => {
    api[type]({
      title: title,
      description: description,
    });
  };

  const goToSection = (id, e) => {
    e?.preventDefault();
    const elementId = document.getElementById(id);
    if (location.pathname === "/") {
      elementId.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate("/", { state: { scrollTo: id } });
  };

  return (
    <header className="bg-white">
      {contextHolder}
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              src="https://static.vecteezy.com/system/resources/previews/022/580/623/non_2x/movie-media-letter-logo-design-illustration-free-vector.jpg"
              className="h-16 w-auto lg:h-22"
              alt="Flowbite Logo"
            />
          </a>
        </div>
        <div className="flex gap-5  lg:gap-x-8">
          <NavLink
            className="text-sm/6 md:text-base/6 lg:text-lg/6 xl:text-xl/6 font-semibold text-gray-900 cursor-pointer hover:text-red-500 duration-200"
            to={"/"}
          >
            Home Page
          </NavLink>
          <button
            className="text-sm/6 md:text-base/6 lg:text-lg/6 xl:text-xl/6 font-semibold text-gray-900 cursor-pointer hover:text-red-500 duration-200"
            onClick={(e) => goToSection("hot_movie", e)}
          >
            Hot Movie
          </button>
          <button
            className="text-sm/6 md:text-base/6 lg:text-lg/6 xl:text-xl/6 font-semibold text-gray-900 cursor-pointer hover:text-red-500 duration-200"
            onClick={(e) => goToSection("now_showing", e)}
          >
            Now Showing
          </button>
          <button
            className="text-sm/6 md:text-base/6 lg:text-lg/6 xl:text-xl/6 font-semibold text-gray-900 cursor-pointer hover:text-red-500 duration-200"
            onClick={(e) => goToSection("new_release", e)}
          >
            New Release
          </button>
        </div>

        <div className="flex lg:flex lg:flex-1 lg:justify-end">
          {userName ? (
            <p
              className="text-emerald-600 cursor-pointer hover:text-lg hover:text-emerald-800 uppercase duration-200 text-xs/6 md:text-sm/6 lg:text-base/6 xl:text-lg/6"
              onClick={() => {
                navigate("/profile");
              }}
            >
              Hello, {userName}
              <button
                type="button"
                className="font-semibold text-red-500 text-base cursor-pointer ml-3  duration-200 hover:text-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  removeKeyLocalStorage("userInfo");
                  dispatch(updateUserName(""));
                  openNotificationWithIcon(
                    "success",
                    "Log Out Successful",
                    "You have been log out",
                  );
                  setTimeout(() => {
                    navigate("/login");
                  }, 2000);
                }}
              >
                Log out
              </button>
            </p>
          ) : (
            <NavLink
              to={"/login"}
              className={({ isActive, isPending }) =>
                "text-sm/6 font-semibold text-gray-900 cursor-pointer hover:text-red-500 duration-200"
              }
            >
              Login / Sign up
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
