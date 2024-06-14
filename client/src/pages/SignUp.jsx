import React from "react";
import toodle from "../assets/doodles-7251441_1280.png";
import { Link } from "react-router-dom";
import { useState } from "react";

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
      console.log(signup);
      setError("Password Doesn't match");
    } else {

      try{
        const postdata = await fetch('http://localhost:4000/api/v1/users/registeruser',{
         method:'POST',
         body:JSON.stringify(signup),
         headers:{'Content-Type':'application/json'},
        })
        console.log(postdata,"This is data from the Post ")
      }
      catch(error)
      {
        console.log(error,"There is Error in register Form")
      }




      setSignUp({
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
      });
      alert("User register Successfully");
      console.log(signup);
      setError("");
    }


  };

   



  return (
    <div className=" bg-black-50 flex items-center justify-center py-12 sm:px-6 lg:px-8 lg:flex-row">
      <div className="hidden lg:block">
        <img
          className="object-cover mt-[4.5rem] mr-9 w-[500px] h-[500px]"
          src={toodle}
        />
      </div>
      <div className="sm:w-full sm:max-w-md ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://www.svgrepo.com/show/301692/login.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-white">
            Create a new account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit}>
              <div className="mt-6">
                <label
                  htmlFor="Username"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-orange focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    id="username"
                    name="username"
                    placeholder="Choose the unique Username user#44"
                    type="text"
                    value={signup.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    placeholder="user@example.com"
                    type="email"
                    value={signup.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-orange focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                    />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-5 text-gray-700"
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
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-orange focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium leading-5 text-gray-700"
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-orange focus:border-orange-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    required
                    />
                </div>
              </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
              Or
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
    </div>
  );
};

export default SignUp;
