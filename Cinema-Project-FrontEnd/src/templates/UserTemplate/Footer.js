import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-primary-soft rounded-base shadow-xs border border-default m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="flex items-center justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-2 space-x-3 rtl:space-x-reverse self-center"
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/022/580/623/non_2x/movie-media-letter-logo-design-illustration-free-vector.jpg"
              className="h-12 md:h-20 w-auto "
              alt="Flowbite Logo"
            />
          </a>
          <ul className="flex flex-wrap items-center text-sm font-medium text-body self-center">
            <li>
              <p className="hover:underline me-2 md:me-5 text-[10px] self-center md:text-lg font-bold">About</p>
            </li>
            <li>
              <p className="hover:underline me-2 md:me-5 text-[10px] self-center md:text-lg font-bold">Privacy Policy</p>
            </li>
            <li>
              <p className="hover:underline me-2 md:me-5 text-[10px] self-center md:text-lg font-bold">Licensing</p>
            </li>
            <li>
              <p className="hover:underline me-2 md:me-5 text-[10px] self-center md:text-lg font-bold">Contact</p>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-default sm:mx-auto lg:my-8" />
        <span className="block text-sm text-body sm:text-center">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Flowbite™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
