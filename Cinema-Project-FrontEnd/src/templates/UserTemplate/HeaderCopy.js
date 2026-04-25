import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { removeKeyLocalStorage } from "../../utils/local";
import { updateUserName } from "../../redux/Slice/userSlice";
import { notification } from "antd";

const HeaderCopy = () => {
  const { userName } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  if (location.pathname === "/") {
    const elementId = document.getElementById(id);
    if (elementId) {
      elementId.scrollIntoView({ behavior: "smooth" });
    }
    return;
  } else {
    navigate("/");
  }
};
  return (
    <header className="bg-white">
      {contextHolder}
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              src="https://static.vecteezy.com/system/resources/previews/022/580/623/non_2x/movie-media-letter-logo-design-illustration-free-vector.jpg"
              className="h-12 md:h-20 w-auto"
              alt="Flowbite Logo"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              data-slot="icon"
              aria-hidden="true"
              className="size-6"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <NavLink
            className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
            to={"/"}
          >
            Home Page
          </NavLink>
          <button
            className="text-sm/6 font-semibold text-gray-900 cursor-pointer hover:text-gray-600"
            onClick={(e) => goToSection("hot_movie", e)}
          >
            Hot Movie
          </button>
          <button
            className="text-sm/6 font-semibold text-gray-900 cursor-pointer hover:text-gray-600"
            onClick={(e) => goToSection("now_showing", e)}
          >
            Now Showing
          </button>
          <button
            className="text-sm/6 font-semibold text-gray-900 cursor-pointer hover:text-gray-600"
            onClick={(e) => goToSection("new_release", e)}
          >
            New Release
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {userName ? (
            <p
              className="text-emerald-600 cursor-pointer hover:text-lg hover:text-emerald-800 uppercase duration-200"
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

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="space-y-1 px-6 pb-6 pt-4">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block rounded-lg px-3 py-2 text-base font-semibold text-red-500"
                  : "block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
              }
            >
              Home Page
            </NavLink>
            <button
              className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer w-full text-left"
              onClick={(e) => goToSection("hot_movie", e)}
            >
              Hot Movie
            </button>
            <button
              className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer w-full text-left"
              onClick={(e) => goToSection("now_showing", e)}
            >
              Now Showing
            </button>
            <button
              className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer w-full text-left"
              onClick={(e) => goToSection("new_release", e)}
            >
              New Release
            </button>
            <div className="border-t border-gray-200 pt-4 mt-4">
              {userName ? (
                <div className="space-y-2">
                  <p
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-emerald-600 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Hello, {userName}
                  </p>
                  <button
                    type="button"
                    className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold text-red-500 hover:bg-gray-50"
                    onClick={() => {
                      removeKeyLocalStorage("userInfo");
                      dispatch(updateUserName(""));
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Login / Sign up
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderCopy;
