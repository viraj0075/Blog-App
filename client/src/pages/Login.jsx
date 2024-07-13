import React, { useState } from "react";
import toodle from "../assets/doodles-7251441_1280.png";
import { Link, Navigate } from "react-router-dom";
import { updateUserInfo } from "../store/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const formValid = loginData.email && loginData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) {
      console.log("All fields are required");
      toast.error("All fields are required",{duration:3500})
    } else {
      try {
        const loginresponse = await fetch(
          "http://localhost:4000/api/v1/users/login",
          {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (loginresponse.ok) {
          loginresponse.json().then((user) => {
            dispatch(updateUserInfo(user?.data?.loggedInUser));
            toast.success("Logged in SuccessFully",{duration:3500})
            setRedirect(true);
            console.log(user);
          });
        } else {
          console.log("Wrong credentials");
          toast.error("Wrong credentials",{duration:3500})

        }
      } catch (error) {
        console.log(error, "Error from loginresponse");
      }

      setLoginData({
        email: "",
        password: "",
      });
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="bg-[#030d2e] min-h-screen flex items-center justify-center py-12 sm:px-6 lg:px-8 lg:flex-row">
      <div className="hidden lg:block">
        <img
          className="object-cover mt-[4.5rem] mr-9 w-[500px] h-[500px]"
          src={toodle}
          alt="Doodle"
        />
      </div>
      <div className="sm:w-full sm:max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-white">
            Log In to Your Account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit}>
              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="block text-md  font-bold mb-2 leading-5 text-white"
                >
                  Enter your email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="block text-md  font-bold mb-2 leading-5 text-white"
                >
                  Password
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  <button
                    type="submit"
                    disabled={!formValid}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                  >
                    Log In
                  </button>
                </span>
              </div>
            </form>
            <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
              Or{" "}
              <Link
                to="/signup"
                className="font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              >
                Create a New Account or Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
