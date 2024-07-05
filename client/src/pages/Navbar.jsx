import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateUserInfo } from "../store/userSlice";
import { useSelector, useDispatch } from 'react-redux';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");

  const userInfo = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();


  const fetchData = async () => {
    const profileResponse = await fetch(
      "http://localhost:4000/api/v1/users/profile",
      {
        credentials: "include",
      });
    if (profileResponse.ok) {
      profileResponse
        .json()
        .then((userdata) => {
          console.log(userdata?.data?.verifiedToken?.username)
          setUsername(userdata?.data?.verifiedToken?.username)
          dispatch(updateUserInfo(userdata?.data?.verifiedToken))
        })
    }
  };

  useEffect(() => {
    fetchData()
  }, []);

  const logout = async () => {
    await fetch("http://localhost:4000/api/v1/users/logout", {
      method: "POST",
      credentials: "include",
    });

    dispatch(updateUserInfo({}))
    setUsername("");

  };

  const user = userInfo?.username;
  console.log(user);

  return (
    <div className="w-full text-gray-700 bg-[#030d2e] bg-opacity-50 dark:text-gray-200 dark:bg-[#030d2e] dark:bg-opacity-1">
      <div className="lg:mx-[15rem] flex flex-col px-4 md:items-center md:justify-between md:flex-row md:px-6 lg:px-12">
        <div className="p-4 flex flex-row items-center justify-between">
          <Link
            to="/"
            className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark:text-white focus:outline-none focus:shadow-outline"
          >
            Mlog
          </Link>
          <button
            className="md:hidden rounded-lg focus:outline-none focus:shadow-outline"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
        <nav
          className={`flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row ${isOpen ? "flex" : "hidden"
            }`}
        >
          <a
            className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-orange-100 dark:focus:bg-orange-100 dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            href="#"
          >
            {user}
          </a>
        
          {user ? (
            <>
              <Link
                className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-orange-100 dark:focus:bg-orange-100 dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                to="/create"
              >
                Create new post
              </Link>
              <p
                className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-orange-100 dark:focus:bg-orange-100 dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                onClick={logout}
              >
                Logout
              </p>
            </>
          ) : (
            <>
              <Link
                className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-orange-100 dark:focus:bg-orange-100 dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-orange-100 dark:focus:bg-orange-100 dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>


  );
};

export default Navbar;
