import { User } from "../models/user.model.js";
import { AsyncHandlers } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { genrateAccessToken, veriftJwtToken } from "../utils/jwtToken.js";
import bcrypt from "bcrypt";

const registerUser = AsyncHandlers(async (req, res) => {
  const { email, username, password, confirmpassword } = req.body;
  console.log(email, "-", username, "-", password, "-", confirmpassword);

  //all feilds are required
  if (
    [email, username, password, confirmpassword].some(
      (items) => items?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Feilds Are Required");
  }

  //for the password and the Confirm Password
  if (password !== confirmpassword) {
    throw new ApiError(401, "Password does not match");
  }

  //chk if the User and email is alredy Registered
  const useroremail = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (useroremail) {
    console.log(useroremail, "User Alredy Exist");
    throw new ApiError(409, "User or email already Registered");
  }

  const newUser = await User.create({
    email,
    username,
    password,
  });
  if (!newUser) {
    console.log(error, "This is error in new User");
    throw new ApiError(400, "User Register failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { newUser }, "User registered Successfully"));
});

const loginUser = AsyncHandlers(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((items) => items?.trim === "")) {
    throw new ApiError(400, "All Feilds is Required");
  }

  const findEmailofUser = await User.findOne({
    $or: [{ email }],
  });

  if (!findEmailofUser) {
    throw new ApiError(400, "Email is not registered");
  }

  const comaprePassword = await bcrypt.compare(
    password,
    findEmailofUser?.password
  );
  console.log(comaprePassword);
  if (!comaprePassword) {
    console.log("This is indiode if");
    throw new ApiError(401, "Invalid credentails");
  }

  const token = await genrateAccessToken(
    findEmailofUser?._id,
    findEmailofUser?.username,
    findEmailofUser?.email,
    findEmailofUser?.password
  );
  console.log(token, "This is Token");
  if (!token) {
    new ApiError(401, "Error in Token Genration");
  }

  const loggedInUser = await User.findById(findEmailofUser._id).select(
    "-password"
  );

  console.log(loggedInUser, "This is logged in User");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", token, options)
    .json(new ApiResponse(200, { loggedInUser }, "User login Successfully"));
});

const userProfile = AsyncHandlers(async (req, res) => {
  const { accessToken } = req.cookies;
  // console.log(accessToken);
  const verifiedToken = await veriftJwtToken(accessToken);
  // console.log(verifiedToken);

  return res
    .status(200)
    .json(new ApiResponse(200, { verifiedToken }, "This is Cookies"));
});

const logoutUser = AsyncHandlers(async (req, res) => {
  let { accessToken } = req.cookies;
  accessToken = "";

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", "", options)
    .json(new ApiResponse(200, { accessToken }, "User Logout Successfully"));
});

const getUserById = AsyncHandlers(async(req,res) => 
{
  const {id} = req.params;
  const userData = await User.findById(id).select("-password");
  if(!userData) 
  {
    throw new ApiError(400, "User is Not Availble");
  }
  console.log(userData, "This is User Data by Id");
  res
  .status(200)
  .json(new ApiResponse(200,{userData},"UserData Fetched Successfully By Id"))

})


const updateUserProfile = AsyncHandlers(async (req, res) => {
  const { accessToken } = req.cookies;
  const verify = await veriftJwtToken(accessToken);
  const { id } = req.params;
  if (verify?._id !== id) {
    throw new ApiError(401, "User is not Authenticated Login Again");
  }

  const { username, imageUrl, password } = req.body;

  const updatedFeild = {};

  if (username) {
    updatedFeild.username = username;
  }
  if (imageUrl) {
    updatedFeild.imageUrl = imageUrl;
  }
  if (password) {
    const newPassword = await bcrypt.hash(password,10);
    console.log(newPassword)
    updatedFeild.password = newPassword;
  }
  console.log(updatedFeild)

  const updatedUserDetails = await User.findByIdAndUpdate(id,
    {
      $set:updatedFeild
    },
    {
      new : true
    }
  ).select("-password");
  if(!updatedUserDetails)
  {
    throw new ApiError(400, "Something wrong in updating user");
  }
  console.log(updatedUserDetails)

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedUserDetails }, "User updated Successfully Successfully")
    );
});

export { registerUser, loginUser, userProfile, logoutUser, updateUserProfile,getUserById };
