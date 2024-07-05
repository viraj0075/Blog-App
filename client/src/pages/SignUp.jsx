import React, { useState } from "react";
import toodle from "../assets/doodles-7251441_1280.png";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [signup, setSignUp] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUp({
      ...signup,
      [name]: value,
    });
  };

  const isFormValid =
    signup.username &&
    signup.email &&
    signup.password &&
    signup.confirmpassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signup.password !== signup.confirmpassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/users/registeruser",
        {
          method: "POST",
          body: JSON.stringify(signup),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        alert("User registered successfully!");
        setSignUp({
          username: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
      } else {
        setError("Error registering user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Error registering user");
    }
  };

  return (
    <div className="bg-[#030d2e] min-h-screen flex items-center justify-center py-12 sm:px-6 lg:px-8 lg:flex-row">
      <div className="mr-6 sm:w-full sm:max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-white">
            Create a new account
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit}>
              <div className="mt-6">
                <label
                  htmlFor="username"
                  className="block text-md  font-bold mb-2 leading-5 text-white "
                >
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={signup.username}
                    onChange={handleChange}
                    placeholder="Choose a unique username"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="block text-md  font-bold mb-2 leading-5 text-white "
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={signup.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="block text-md  font-bold mb-2 leading-5 text-white "
                >
                  Password
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={signup.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="confirmpassword"
                  className="block text-md  font-bold mb-2 leading-5 text-white "
                >
                  Confirm Password
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    value={signup.confirmpassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                  >
                    Create account
                  </button>
                </span>
              </div>
            </form>
            <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              >
                Login to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <img
          className="object-cover mt-[4.5rem] mr-9 w-[500px] h-[500px]"
          src={toodle}
          alt="Doodle"
        />
      </div>
    </div>
  );
};

export default SignUp;
